import { db } from "../config/dbconnect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const authCodes = {};

const show_form = async (req, res) => {
    const { client_id, redirect_uri, state } = req.query;
    if (!client_id || !redirect_uri) {
        return res.status(400).json({ error: "Missing clientId or redirect_uri" });
    }
    try {
        const sql = "SELECT * FROM client WHERE id = ?";
        db.get(sql, [client_id], (err, row) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database error" });
            }
            if (!row || row.redirectUri !== redirect_uri) {
                return res.status(404).json({ error: "Client not found" });
            }

            res.send(`
                <form method="POST" action="/authorize/login">
                  <label>Username: <input name="username" /></label><br/>
                  <label>Password: <input name="password" type="password" /></label><br/>
                  <input type="hidden" name="client_id" value="${client_id}" />
                  <input type="hidden" name="redirect_uri" value="${redirect_uri}" />
                  <input type="hidden" name="state" value="${state}" />
                  <button type="submit">Login</button>
                </form>
            `);
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
}

const login = async (req, res) => {
    const { username, password, client_id, redirect_uri, state } = req.body;
    if (!username || !password || !client_id || !redirect_uri) {
        return res.status(400).json({ error: "Missing username, password, clientId or redirect_uri" });
    }

    const sql = "SELECT * FROM user WHERE username = ?";
    db.get(sql, [username], async (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
        if (!row || !(await bcrypt.compare(password, row.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const code = Math.random().toString(36).substring(2, 15);
        authCodes[code] = { client_id: client_id, username: username };

        setTimeout(() => {
            delete authCodes[code];
        }, 5 * 60 * 1000);

        console.log(`Authorization code generated: ${code}`);
        return res.redirect(`${redirect_uri}?code=${code}&state=${state}`);
    });
}

const get_token = async (req, res) => {
    const { client_id, client_secret, code } = req.body;
    if (!client_id || !client_secret || !code) {
        return res.status(400).json({ error: "Missing clientId, clientSecret or authCode" });
    }

    const sql = "SELECT * FROM client WHERE id = ?";
    db.get(sql, [client_id], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
        if (!row || row.secret !== client_secret) {
            return res.status(401).json({ error: "Invalid client credentials" });
        }

        const authCode = authCodes[code];
        if (!authCode || authCode.client_id !== client_id) {
            return res.status(400).json({ error: "Invalid authorization code" });
        }

        const token = jwt.sign(
            { username: authCode.username ,
                authors: "70357_70369"
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        delete authCodes[code];

        return res.json({
            access_token: token,
            token_type: "Bearer",
            expires_in: 3600
        });
    });
}
export { show_form, login, get_token };
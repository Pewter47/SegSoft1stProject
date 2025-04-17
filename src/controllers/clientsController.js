import { db } from "../config/dbconnect.js";

const register = async (req, res) => {
    const { clientID, clientSecret, redirectUri } = req.body;
    if (!clientID || !clientSecret || !redirectUri) {
        return res.status(400).json({ error: "Missing id, secret or redirectUri" });
    }
    try {
        const sql =
            `INSERT INTO client (id, secret, redirectUri) VALUES (?, ?, ?)`;
        db.run(sql, [clientID, clientSecret, redirectUri], function (err) {
            if (err) {
                console.error(err);
                return res.status(400).json({ error: err.message });
            }
            return res.status(201).json({
                clientID: clientID,
                clientSecret: clientSecret,
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
};
const check = async (req, res) => {
    const { clientID } = req.body;
    if (!clientID) {
        return res.status(400).json({ error: "Missing id" });
    }
    try {
        const sql = "SELECT * FROM client WHERE id = ?";
        db.get(sql, [clientID], (err, row) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Database error" });
            }
            if (!row) {
                return res.status(404).json({ error: "Client not found" });
            }
            return res.status(200).json({
                clientID: row.id,
                clientSecret: row.secret,
                redirectUri: row.redirectUri,
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
};
export { register, check };
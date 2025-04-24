import { db } from "../config/dbconnect.js";

const register = async (req, res) => {
    const { client_id, client_secret, name, redirect_uri } = req.body;
    if (!client_id || !client_secret || !name || !redirect_uri) {
        return res.status(400).json({ error: "Missing id, secret, application name or redirect_uri" });
    }
    try {
        const sql =
            `INSERT INTO client (id, secret, name, redirect_uri) VALUES (?, ?, ?, ?)`;
        db.run(sql, [client_id, client_secret, name, redirect_uri], function (err) {
            if (err) {
                console.error(err);
                return res.status(400).json({ error: err.message });
            }
            return res.status(201).json({
                client_id: client_id,
                client_secret: client_secret,
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
};
export { register };
import { db } from "../config/dbconnect.js";

const register = async (req, res) => {
    const { clientID, clientSecret, name, redirectUri } = req.body;
    if (!clientID || !clientSecret || !name || !redirectUri) {
        return res.status(400).json({ error: "Missing id, secret, application name or redirectUri" });
    }
    try {
        const sql =
            `INSERT INTO client (id, secret, name, redirectUri) VALUES (?, ?, ?, ?)`;
        db.run(sql, [clientID, clientSecret, name, redirectUri], function (err) {
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
export { register };
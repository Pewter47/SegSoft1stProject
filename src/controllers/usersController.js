import { db } from "../config/dbconnect.js";
import bcrypt from "bcryptjs";

const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPasswd = await bcrypt.hash(password, 10);
    const sql =
      `INSERT INTO user (username, password) VALUES (?, ?)`;
    db.run(sql, [username, hashedPasswd], function (err) {
      if (err) {
        console.error(err);
        return res.status(400).json({ error: err.message });
      }
      return res.status(201).json({
        id: this.lastID,
        username,
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export { register };
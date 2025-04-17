import { db } from "../config/dbconnect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }
  const sql = "SELECT * FROM user WHERE username = ?";
  db.get(sql, [username], async (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    if (!row) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Compare the plain password with the hashed password
    const match = await bcrypt.compare(password, row.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { username: row.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.json({
      message: "Login successful",
      token,
    });
  });
};
export { register, login };
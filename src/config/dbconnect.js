import sqlite3Module from 'sqlite3';
const sqlite3 = sqlite3Module.verbose();
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, "database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error connecting to SQLite database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

const init = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
    )
    `, (err) => {
    if (err) {
      console.error("Error creating user table:", err.message);
    } else {
      console.log("User table is ready (if it did not already exist).");
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS client (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    secret TEXT NOT NULL,
    redirectUri TEXT NOT NULL
    )
    `, (err) => {
    if (err) {
      console.error("Error creating client table:", err.message);
    } else {
      console.log("Client table is ready (if it did not already exist).");
    }
  });
};
export { db, init };
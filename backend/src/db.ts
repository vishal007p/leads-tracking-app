import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import "./config/env.js";

const dbPath = process.env.DB_PATH || path.resolve(process.cwd(), "data", "leads.db");

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new'
      CHECK (status IN ('new', 'contacted', 'qualified', 'lost')),
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    leadId INTEGER NOT NULL,
    content TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (leadId) REFERENCES leads(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_notes_leadId ON notes(leadId);
`);

export default db;
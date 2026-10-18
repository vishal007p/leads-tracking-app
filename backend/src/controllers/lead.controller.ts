import type { Request, Response } from "express";
import { LEAD_STATUSES } from "../constants/statuses.js";
import db from "../db.js";

export const getLeads = (req: Request, res: Response) => {
  const search = String(req.query.search ?? "").trim();
  const status = String(req.query.status ?? "").trim();

  if (status && !LEAD_STATUSES.includes(status as (typeof LEAD_STATUSES)[number])) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  let sql = "SELECT * FROM leads WHERE 1 = 1";
  const params: string[] = [];

  if (search) {
    sql += " AND (name LIKE ? OR email LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  if (status) {
    sql += " AND status = ?";
    params.push(status);
  }

  sql += " ORDER BY id DESC";

  const leads = db.prepare(sql).all(...params);

  return res.status(200).json({ success: true, data: leads });
};

export const createLead = (req: Request, res: Response) => {
  const { name, email, phone, status = "new" } = req.body;

  const created = db
    .prepare("INSERT INTO leads (name, email, phone, status) VALUES (?, ?, ?, ?)")
    .run(name, email, phone, status);

  const lead = db
    .prepare("SELECT * FROM leads WHERE id = ?")
    .get(created.lastInsertRowid);

  return res.status(201).json({ success: true, data: lead });
};

export const getLeadById = (_req: Request, res: Response) => {
  const id = res.locals.id as number;

  const lead = db.prepare("SELECT * FROM leads WHERE id = ?").get(id);

  if (!lead) {
    return res.status(404).json({ success: false, message: "Lead not found" });
  }

  const notes = db
    .prepare("SELECT * FROM notes WHERE leadId = ? ORDER BY id DESC")
    .all(id);

  return res.status(200).json({
    success: true,
    data: { ...(lead as object), notes },
  });
};

export const updateLead = (req: Request, res: Response) => {
  const id = res.locals.id as number;

  const existing = db.prepare("SELECT id FROM leads WHERE id = ?").get(id);

  if (!existing) {
    return res.status(404).json({ success: false, message: "Lead not found" });
  }

  // Skip undefined values (e.g. empty status) so SQLite never gets "undefined"
  const entries = Object.entries(req.body).filter(([, v]) => v !== undefined);
  const setClause = entries.map(([key]) => `${key} = ?`).join(", ");
  const values = entries.map(([, value]) => value);

  db.prepare(`UPDATE leads SET ${setClause} WHERE id = ?`).run(...values, id);

  const updated = db.prepare("SELECT * FROM leads WHERE id = ?").get(id);

  return res.status(200).json({ success: true, data: updated });
};

export const deleteLead = (_req: Request, res: Response) => {
  const id = res.locals.id as number;

  const result = db.prepare("DELETE FROM leads WHERE id = ?").run(id);

  if (result.changes === 0) {
    return res.status(404).json({ success: false, message: "Lead not found" });
  }

  return res.status(204).send();
};

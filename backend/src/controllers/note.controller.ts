import type { Request, Response } from "express";
import db from "../db";

export const addNote = (req: Request, res: Response) => {
  const id = res.locals.id as number;

  const lead = db.prepare("SELECT id FROM leads WHERE id = ?").get(id);

  if (!lead) {
    return res.status(404).json({ success: false, message: "Lead not found" });
  }

  const created = db
    .prepare("INSERT INTO notes (leadId, content) VALUES (?, ?)")
    .run(id, req.body.content);

  const note = db
    .prepare("SELECT * FROM notes WHERE id = ?")
    .get(created.lastInsertRowid);

  return res.status(201).json({ success: true, data: note });
};

export const getNotes = (_req: Request, res: Response) => {
  const id = res.locals.id as number;

  const lead = db.prepare("SELECT id FROM leads WHERE id = ?").get(id);

  if (!lead) {
    return res.status(404).json({ success: false, message: "Lead not found" });
  }

  const notes = db
    .prepare("SELECT * FROM notes WHERE leadId = ? ORDER BY id DESC")
    .all(id);

  return res.status(200).json({ success: true, data: notes });
};

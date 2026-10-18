import { Router } from "express";
import {
  createLead,
  deleteLead,
  getLeadById,
  getLeads,
  updateLead,
} from "../controllers/lead.controller.js";
import { addNote, getNotes } from "../controllers/note.controller.js";
import { validateBody } from "../middleware/validateBody.js";
import { validateId } from "../middleware/validateId.js";
import { createLeadSchema, updateLeadSchema } from "../validators/lead.validator.js";
import { createNoteSchema } from "../validators/note.validator.js";

const router = Router();

router.param("id", validateId);

router.get("/", getLeads);
router.post("/", validateBody(createLeadSchema), createLead);

router.get("/:id", getLeadById);
router.patch("/:id", validateBody(updateLeadSchema), updateLead);
router.delete("/:id", deleteLead);

router.get("/:id/notes", getNotes);
router.post("/:id/notes", validateBody(createNoteSchema), addNote);

export default router;

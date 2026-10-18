import { Router } from "express";
import leadRoutes from "./lead.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "Leads API is running",
  });
});

router.use("/leads", leadRoutes);

export default router;

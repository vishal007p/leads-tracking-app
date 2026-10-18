import dotenv from "dotenv";

dotenv.config();

export const PORT = Number(process.env.PORT) || 5000;
export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

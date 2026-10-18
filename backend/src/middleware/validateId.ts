import type { NextFunction, Request, Response } from "express";

export const validateId = (
  _req: Request,
  res: Response,
  next: NextFunction,
  value: string
) => {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({
      success: false,
      message: "Invalid lead ID",
    });
  }

  res.locals.id = id;
  return next();
};

import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (
    username === process.env.DASHBOARD_USER &&
    password === process.env.DASHBOARD_PASS
  ) {
    const payload = { username };
    const token = jwt.sign(payload, String(process.env.JWT_SECRET), {
      expiresIn: "1d", // ou '2h', '7d', etc.
    });

    return res.status(200).json({
      message: "Login bem-sucedido",
      token,
    });
  }

  return res.status(401).json({ message: "Credenciais inválidas" });
};

import { Request, Response } from "express";
import * as authService from "./auth.service";
import { validarRegistro, validarLogin } from "./auth.validation";

export async function registrar(req: Request, res: Response) {
  const errores = validarRegistro(req.body);
  if (errores.length) return res.status(400).json({ errores });

  const { username, password, rol } = req.body;
  const resultado = await authService.registrar(username, password, rol);
  res.status(201).json(resultado);
}

export async function login(req: Request, res: Response) {
  const errores = validarLogin(req.body);
  if (errores.length) return res.status(400).json({ errores });

  const { username, password } = req.body;
  const resultado = await authService.login(username, password);
  res.json(resultado);
}

export async function refrescar(req: Request, res: Response) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: "refreshToken requerido" });
  const resultado = authService.refrescarToken(refreshToken);
  res.json(resultado);
}
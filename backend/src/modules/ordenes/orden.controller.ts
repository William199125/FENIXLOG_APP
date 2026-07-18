import { Request, Response } from "express";
import * as service from "./orden.service";

export async function listar(_req: Request, res: Response) {
  const ordenes = await service.obtenerOrdenes();
  res.json(ordenes);
}

export async function crear(req: Request, res: Response) {
  const orden = await service.crearOrden(req.body);
  res.status(201).json(orden); // responde de inmediato; la notificación se procesa en segundo plano
}
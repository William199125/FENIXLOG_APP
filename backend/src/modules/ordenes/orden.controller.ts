import { Request, Response } from "express";
import * as service from "./orden.service";

export async function listar(_req: Request, res: Response) {
  const ordenes = await service.obtenerOrdenes();
  res.json(ordenes);
}

export async function crear(req: Request, res: Response) {
  const { descripcion } = req.body;
  const errores: Record<string, string> = {};
  if (!descripcion) errores.descripcion = "La descripción es requerida";

  if (Object.keys(errores).length > 0) {
    return res.status(422).json({ errores });
  }

  const orden = await service.crearOrden(req.body);
  res.status(201).json(orden);
}

export async function actualizar(req: Request, res: Response) {
  const orden = await service.actualizarOrden(Number(req.params.id), req.body);
  res.json(orden);
}

export async function eliminar(req: Request, res: Response) {
  await service.eliminarOrden(Number(req.params.id));
  res.status(204).send();
}
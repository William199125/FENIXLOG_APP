import { Request, Response } from "express";
import * as service from "./vehiculo.service";

export async function listar(req: Request, res: Response) {
  const { page, limit, estado, provincia } = req.query;

  const opciones = {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    estado: estado ? String(estado) : undefined,
    provincia: provincia ? String(provincia) : undefined,
  };

  const vehiculos = await service.obtenerVehiculos(opciones);
  res.json(vehiculos);
}

export async function crear(req: Request, res: Response) {
  const { tipo, registro, estado } = req.body;
  const errores: Record<string, string> = {};
  if (!tipo) errores.tipo = "El tipo es requerido";
  if (!registro) errores.registro = "El registro es requerido";
  if (!estado) errores.estado = "El estado es requerido";

  if (Object.keys(errores).length > 0) {
    return res.status(422).json({ errores });
  }

  const vehiculo = await service.crearVehiculo(req.body);
  res.status(201).json(vehiculo);
}

export async function actualizar(req: Request, res: Response) {
  const vehiculo = await service.actualizarVehiculo(Number(req.params.id), req.body);
  res.json(vehiculo);
}

export async function eliminar(req: Request, res: Response) {
  await service.eliminarVehiculo(Number(req.params.id));
  res.status(204).send();
}
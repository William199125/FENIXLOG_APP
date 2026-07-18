import { Request, Response } from "express";
import * as service from "./vehiculo.service";

export async function listar(_req: Request, res: Response) {
  const vehiculos = await service.obtenerVehiculos();
  res.json(vehiculos);
}

export async function crear(req: Request, res: Response) {
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
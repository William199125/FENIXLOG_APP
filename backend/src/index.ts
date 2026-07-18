import "dotenv/config";
import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { errorMiddleware } from "./middlewares/error.middleware";

import authRoutes from "./modules/auth/auth.routes";
import vehiculoRoutes from "./modules/vehiculos/vehiculo.routes";
import ordenRoutes from "./modules/ordenes/orden.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/vehiculos", vehiculoRoutes);
app.use("/ordenes", ordenRoutes);

app.use(errorMiddleware);

app.listen(env.PORT, () => {
  console.log(`Servidor FENIX LOG corriendo en http://localhost:${env.PORT}`);
});
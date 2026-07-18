import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt.util";

export async function registrar(username: string, password: string, rol = "MILITAR") {
  const existente = await prisma.usuario.findUnique({ where: { username } });
  if (existente) throw { status: 409, message: "El usuario ya existe" };

  const hash = await bcrypt.hash(password, 10);
  const usuario = await prisma.usuario.create({
    data: { username, password: hash, rol },
  });

  return generarTokens(usuario);
}

export async function login(username: string, password: string) {
  const usuario = await prisma.usuario.findUnique({ where: { username } });
  if (!usuario) throw { status: 401, message: "Credenciales inválidas" };

  const passwordOk = await bcrypt.compare(password, usuario.password);
  if (!passwordOk) throw { status: 401, message: "Credenciales inválidas" };

  return generarTokens(usuario);
}

export function refrescarToken(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  return {
    accessToken: signAccessToken({ id: payload.id, username: payload.username, rol: payload.rol }),
  };
}

function generarTokens(usuario: { id: number; username: string; rol: string }) {
  const payload = { id: usuario.id, username: usuario.username, rol: usuario.rol };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    usuario: payload,
  };
}
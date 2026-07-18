export function validarRegistro(body: any) {
  const errores: string[] = [];
  if (!body.username || body.username.length < 4) errores.push("username debe tener al menos 4 caracteres");
  if (!body.password || body.password.length < 6) errores.push("password debe tener al menos 6 caracteres");
  return errores;
}

export function validarLogin(body: any) {
  const errores: string[] = [];
  if (!body.username) errores.push("username es requerido");
  if (!body.password) errores.push("password es requerido");
  return errores;
}
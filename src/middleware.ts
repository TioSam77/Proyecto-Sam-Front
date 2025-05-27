import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Función para decodificar JWT sin verificar firma
function decodeJwt(token: string) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
    return decoded;
  } catch (error) {
    return null;
  }
}

// Mapa de rutas permitidas por rol
const roleAccess: Record<string, string[]> = {
  admin: ['/Administrador'],
  superAdmin: ['/Administrador'],
  teacher: ['/Profesor'],
  student: ['/Alumno'],
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const decoded = decodeJwt(token);
  const role = decoded?.role;

  const pathname = request.nextUrl.pathname;

  // Si el rol no está definido o no tiene acceso a esta ruta
  const allowedPaths = roleAccess[role] || [];

  const isAllowed = allowedPaths.some((allowedPath) => pathname.startsWith(allowedPath));

  if (!isAllowed) {
    // Redirigir a su ruta permitida principal (primera del array)
    const redirectTo = allowedPaths[0] || '/';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/Administrador/:path*',
    '/Alumno/:path*',
    '/Profesor/:path*',
  ],
};

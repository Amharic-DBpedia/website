import { env } from "../app/env";

export function backendUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${env.apiBase.replace(/\/$/, "")}${normalizedPath}`;
}

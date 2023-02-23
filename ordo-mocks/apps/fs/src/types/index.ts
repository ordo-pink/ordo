import type { CORSOptions } from "@marblejs/middleware-cors/dist/middleware";

export interface Environment {
  production: boolean;
  cwd: string;
  cors: CORSOptions;
}

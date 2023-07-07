export const isObject = (x: unknown): x is Record<string, unknown> =>
  x != null && typeof x === "object" && !Array.isArray(x);

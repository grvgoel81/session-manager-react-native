
export * from "./types/State";
export { default } from "./SessionManager";

export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b);
}

import * as dntShim from "../../../_dnt.shims.js";
const DEBUG = dntShim.Deno.env.get("DEBUG") === "true";

export class Logger {
  // deno-lint-ignore no-explicit-any
  public static info(...data: any[]): void {
    if (!DEBUG) return;
    console.info("[INFO]", ...data);
  }
  // deno-lint-ignore no-explicit-any
  public static error(...data: any[]): void {
    if (!DEBUG) return;
    console.error("[ERROR]", ...data);
  }
  // deno-lint-ignore no-explicit-any
  public static warn(...data: any[]): void {
    if (!DEBUG) return;
    console.warn("[WARN]", ...data);
  }
  // deno-lint-ignore no-explicit-any
  public static debug(...data: any[]): void {
    if (!DEBUG) return;
    console.debug("[DEBUG]", ...data);
  }
  // deno-lint-ignore no-explicit-any
  public static log(...data: any[]): void {
    if (!DEBUG) return;
    console.log("[LOG]", ...data);
  }
}

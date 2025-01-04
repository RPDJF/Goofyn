import * as dntShim from "../../../_dnt.shims.js";
const DEBUG = dntShim.Deno.env.get("DEBUG") === "true";
export class Logger {
    // deno-lint-ignore no-explicit-any
    static info(...data) {
        if (!DEBUG)
            return;
        console.info("[INFO]", ...data);
    }
    // deno-lint-ignore no-explicit-any
    static error(...data) {
        if (!DEBUG)
            return;
        console.error("[ERROR]", ...data);
    }
    // deno-lint-ignore no-explicit-any
    static warn(...data) {
        if (!DEBUG)
            return;
        console.warn("[WARN]", ...data);
    }
    // deno-lint-ignore no-explicit-any
    static debug(...data) {
        if (!DEBUG)
            return;
        console.debug("[DEBUG]", ...data);
    }
    // deno-lint-ignore no-explicit-any
    static log(...data) {
        if (!DEBUG)
            return;
        console.log("[LOG]", ...data);
    }
}

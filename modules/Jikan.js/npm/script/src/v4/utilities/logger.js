"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const dntShim = __importStar(require("../../../_dnt.shims.js"));
const DEBUG = dntShim.Deno.env.get("DEBUG") === "true";
class Logger {
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
exports.Logger = Logger;

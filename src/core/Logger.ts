import type LocalStreamError from "../struct/LocalStreamError";
import { existsSync, writeFileSync, appendFileSync } from "fs";

export default class Logger {
  static generateErrorLog(error: LocalStreamError): boolean {
    try {
      if (!Logger.checkIfLogFileExists()) {
        writeFileSync(
          "./local-stream-error.log",
          `=== Error Log ===\n${error.stack}\n=========\n`
        );
      } else {
        appendFileSync(
          "./local-stream-error.log",
          `${error.stack}\n=================\n`
        );
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  private static checkIfLogFileExists() {
    return existsSync("./local-stream-error.log");
  }
}

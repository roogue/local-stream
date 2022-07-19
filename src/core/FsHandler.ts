import _path from "path";
import { readFileSync, existsSync, writeFileSync } from "fs";
import Config from "../struct/Config";
import Logger from "./Logger";
import LocalStreamError from "../struct/LocalStreamError";

export default class FsHandler {
  private readonly path: string = _path.join(__dirname, "../../");

  public writeConfig(config: Config): void {
    const configPath = _path.join(this.path, "config.json");

    try {
      writeFileSync(configPath, JSON.stringify(config));
    } catch (e) {
      Logger.generateErrorLog(new LocalStreamError("UNABLE_TO_WRITE_FILE", e));
    }
  }

  public readConfig(): Config {
    const configPath = _path.join(this.path, "config.json");

    if (!existsSync(configPath)) this.createConfig(configPath);
    const configJson = JSON.parse(readFileSync(configPath, "utf8"));

    return new Config(configJson);
  }

  private createConfig(path: string): void {
    const defaultConfig: Config = {
      port: 7237,
      directory: process.cwd(),
    };
    // Create config file with default values
    try {
      writeFileSync(path, JSON.stringify(defaultConfig));
    } catch (e) {
      Logger.generateErrorLog(new LocalStreamError("UNABLE_TO_WRITE_FILE", e));
    }
  }
}

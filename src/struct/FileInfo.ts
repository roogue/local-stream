import { Stats, statSync } from "fs";
import _path from "path";
import { config } from "../config";
import Util from "./Util";

export default class FileInfo {
  path: string;
  shortPath: string;
  private fsStats: Stats | null;
  ext: string;
  name: string;
  size?: number;
  formattedSize: string;
  createdTimestamp?: Date;
  formattedCreatedTimestamp: string;

  constructor(path: string) {
    this.path = path;
    this.shortPath = Util.getFileAfterPath(path, config.dir);
    this.fsStats = this.getFsStat();
    this.ext = _path.extname(this.path);
    this.name = this.getFileName();
    this.size = this.fsStats?.size;
    this.formattedSize = Util.formatBytes(this.size ?? 0);
    this.createdTimestamp = this.fsStats?.ctime;
    this.formattedCreatedTimestamp =
      this.createdTimestamp?.toLocaleString() ?? "Unknown";
  }

  private getFileName(): string {
    const baseName = _path.basename(this.path);
    const lastIndex = baseName.lastIndexOf(".");
    return lastIndex > 0 ? baseName.slice(0, lastIndex) : baseName;
  }

  private getFsStat(): Stats | null {
    try {
      return statSync(this.path);
    } catch (e) {
      return null;
    }
  }
}

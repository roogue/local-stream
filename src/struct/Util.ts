import { readdirSync } from "fs";
import _path from "path";

export default class Util {
  public static loadFiles = (
    path: string,
    callback: (path: string) => void
  ) => {
    const loadDir = (dir: string) => {
      readdirSync(dir, { withFileTypes: true }).map((file) => {
        const path = `${dir}/${file.name}`;
        if (file.isDirectory()) return loadDir(path);
        return callback(path);
      });
    };
    return loadDir(path);
  };

  public static getFileAfterPath(path: string, defaultPath: string): string {
    const pathArr = path.split("/");
    const defaultPathArr = defaultPath.split("/");
    return pathArr.filter((i) => defaultPathArr.indexOf(i) < 0).join("//");
  }

  public static isVideoExt(name: string): boolean {
    const regex = /\.(mp4|mov|wmv|avi|mkv|flv)$/gim;
    return regex.test(name);
  }

  public static formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
}

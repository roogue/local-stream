import { readdirSync } from "fs";
import * as _path from "path";

export default class Util {
  public static loadFiles = async (
    path: string,
    defaultPath: string,
    callback: (path: string, shortcut: string) => Promise<unknown>
  ): Promise<unknown> => {
    const loadDir = async (dir: string): Promise<unknown> =>
      await Promise.all(
        readdirSync(dir, { withFileTypes: true }).map(async (file) => {
          const path = `${dir}/${file.name}`;
          if (file.isDirectory()) return await loadDir(path);

          return await callback(
            path,
            this.getFileAfterPath(path, defaultPath)
          );
        })
      );
    return await loadDir(path);
  };

  public static getFileAfterPath(path: string, defaultPath: string): string {
    const pathArr = path.split(_path.sep);
    const defaultPathArr = defaultPath.split(_path.sep);
    return pathArr.filter((i) => defaultPathArr.indexOf(i) < 0).join("//");
  }
}

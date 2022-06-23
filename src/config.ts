import { readFileSync } from "fs";
import { parse } from "ini";

const { General } = parse(readFileSync("./config.ini", "utf-8"));

export const config = {
  port: Number(General.port),
  dir: !!General.dir ? String(General.dir).replace("\\", "/") : undefined,
};

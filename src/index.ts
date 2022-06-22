import { createReadStream, existsSync } from "fs";
import * as _path from "path";
import Client from "./struct/Client";
import { config } from "./config";
import Util from "./struct/Util";

const { port, dir } = config;
const app = new Client(port, dir);

app.get("/file", (req, res) => {
  const dir = req.query.dir as string | undefined;
  if (!dir) return res.status(400).send("Dir is required");

  try {
    const path = _path.resolve(`${app.path}${decodeURI(dir)}`);
    const file = existsSync(path) ? createReadStream(path) : null;

    if (file) {
      res.status(200);
      file.pipe(res);
    } else throw new Error("File not found");
  } catch (err) {
    const errorMessage = (err as Error).message;
    res.status(404).send(errorMessage);
    console.error(errorMessage);
  }
});

app.get("/list", async (_, res) => {
  const path = app.path;
  const files: string[] = [];

  await Util.loadFiles(path, app.path, async (_, shorts: string) =>
    files.push(shorts)
  );

  res.send(files);
});

// 404
app.get("*", (_, res) => {
  res.status(404).send("Not found");
});

app.listen();

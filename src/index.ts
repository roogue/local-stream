import { createReadStream, existsSync, statSync } from "fs";
import * as _path from "path";
import Client from "./struct/Client";
import { config } from "./config";
import Util from "./struct/Util";

const { port, dir } = config;
const app = new Client(port, dir);

app.get("/file", (req, res) => {
  const dir = req.query.dir as string | undefined;
  if (!dir) return res.status(400).send("Dir is required");

  res.render(_path.join(__dirname + "/../public/index.ejs"), {
    dir,
  });
});

app.get("/video", (req, res) => {
  const dir = req.query.dir as string | undefined;
  if (!dir) return res.sendStatus(404);

  const path = _path.resolve(`${app.path}/${decodeURI(dir)}`);

  const stat = statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunksize = end - start + 1;
    const file = createReadStream(path, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    createReadStream(path).pipe(res);
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

import express, { Application } from "express";
import Util from "../struct/Util";
import FileInfo from "../struct/FileInfo";
import type { Server } from "http";
import Logger from "./Logger";
import LocalStreamError from "../struct/LocalStreamError";
import _path from "path";
import { statSync, createReadStream } from "fs";

export default class RequestHandler {
  private app: Application = express();
  private server?: Server;
  private readonly port: number;
  private directory: string;

  constructor(port: number, directory: string) {
    this.directory = directory;

    this.app.get("/list", (_, res) => {
      try {
        const files: FileInfo[] = [];

        Util.loadFiles(this.directory, (path) => {
          const file = new FileInfo(path, this.directory);
          if (Util.isVideoExt(file.shortPath)) files.push(file);
        });

        res.send(files);
      } catch (e) {
        Logger.generateErrorLog(
          new LocalStreamError("UNABLE_TO_LIST_FILES", e)
        );
        res.sendStatus(500);
      }
    });

    this.app.get("/file", (req, res) => {
      const dir = req.query.dir as string | undefined;
      if (!dir) return res.status(400).send("Dir is required");

      try {
        res.setHeader("Content-Type", "text/html");
        return res.send(`<video id="videoPlayer" autoplay muted>
        <source id="src" src="/video?dir=${dir}" type="video/mp4" />
        </video>`);
      } catch (e) {
        Logger.generateErrorLog(
          new LocalStreamError("UNABLE_TO_LOAD_FILES", e)
        );
        return res.sendStatus(500);
      }
    });

    this.app.get("/video", (req, res) => {
      const dir = req.query.dir as string | undefined;
      if (!dir) return res.sendStatus(404);

      try {
        const path = _path.resolve(`${this.directory}/${decodeURI(dir)}`);

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
          return file.pipe(res);
        } else {
          const head = {
            "Content-Length": fileSize,
            "Content-Type": "video/mp4",
          };
          res.writeHead(200, head);
          return createReadStream(path).pipe(res);
        }
      } catch (e) {
        Logger.generateErrorLog(
          new LocalStreamError("UNABLE_TO_STREAM_FILES", e)
        );
        return res.sendStatus(500);
      }
    });

    // Handle 404 error
    this.app.get("*", (_, res) => res.sendStatus(404));

    // Range port 1025 - 65535
    if (port <= 1024) this.port = 1025;
    else if (port >= 65536) this.port = 65535;
    else this.port = port;

    this.server = this.app.listen(this.port);
  }

  // Stop server
  stop(): void {
    this.server?.close();
  }

  // Port getter
  getPort(): number {
    return this.port;
  }

  // Directory getter & setter
  getDirectory(): string {
    return this.directory;
  }
  setDirectory(directory: string): void {
    this.directory = directory;
  }
}

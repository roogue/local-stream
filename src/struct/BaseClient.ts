import express, { Application } from "express";
import { address } from "ip";

export default class BaseClient {
  port: number;
  client: Application = express();

  constructor(port: number) {
    this.port = port;
  }

  public get(
    path: string,
    callback: (req: express.Request, res: express.Response) => void
  ): void {
    this.client.get(path, callback);
  }

  public listen(): void {
    this.client.listen(this.port, () => {
      console.log("Listen on port: ", this.port);
      console.log("Your IP Address: ", address());
    });
  }
}

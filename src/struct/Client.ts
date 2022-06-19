import BaseClient from "./BaseClient";

export default class Client extends BaseClient {
  path: string;

  constructor(port: number, path?: string) {
    super(port);
    this.path = path ?? process.cwd();
  }
  
}

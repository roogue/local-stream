export default class Config {
  port: number;
  directory: string;

  constructor(config: any) {
    this.port = config.port ?? 7237;
    this.directory = config.directory ?? process.cwd();
  }
}

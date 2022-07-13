import express from "express";
import BaseClient from "./BaseClient";
import _path from "path";

export default class Client extends BaseClient {
  path: string;

  constructor(port: number, path?: string) {
    super(port);
    this.path = path ?? process.cwd();
  }

  public load() {
    this.client.set("view engine", "ejs");
    this.client.engine("ejs", require("ejs").__express);
  }
}

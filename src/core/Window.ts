import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import _path from "path";

export default class Window extends BrowserWindow {
  constructor(options: BrowserWindowConstructorOptions) {
    super(options);
  }
}

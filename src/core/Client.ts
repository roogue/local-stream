import { app, ipcMain } from "electron";
import _path from "path";
import LocalStreamError from "../struct/LocalStreamError";
import Logger from "./Logger";
import Window from "./Window";
import { address } from "ip";

export default class Client {
  // Only available after run() is called
  mainWindow?: Window;
  viewsPath: string = _path.join(__dirname, "../../views");

  async run(): Promise<boolean> {
    try {
      // Wait for app to be ready
      await app.whenReady().catch();

      // Registering handler
      ipcMain.handle("ip-address", () => address());
      ipcMain.handle("port", () => "PORT"); // TODO: Customize-able port

      // Create a new window
      this.mainWindow = new Window({
        width: 800,
        height: 600,
        webPreferences: {
          preload: _path.join(__dirname, "../struct/Preload.js"), // Js because compiled
        },
      });

      // Load the home page of the app
      await this.mainWindow.loadFile(this.resolvePath("/html/home.html"));

      // Listen for window close event then quit entirely
      app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
      });

      // Return true to indicate success
      return true;
    } catch (err) {
      Logger.generateErrorLog(
        new LocalStreamError("INITIALIZATION_FAILED", err)
      );
      return false;
    }
  }

  private resolvePath(path: string): string {
    return _path.join(this.viewsPath, path);
  }
}

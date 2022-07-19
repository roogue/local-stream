import { app, ipcMain, dialog } from "electron";
import _path from "path";
import LocalStreamError from "../struct/LocalStreamError";
import Logger from "./Logger";
import Window from "./Window";
import { address } from "ip";
import RequestHandler from "./RequestHandler";
import FsHandler from "./FsHandler";
import type Config from "../struct/Config";

export default class Client {
  // Only available after run() is called
  mainWindow?: Window;
  viewsPath: string = _path.join(__dirname, "../../views");

  fsHandler: FsHandler = new FsHandler();
  config: Config = this.fsHandler.readConfig();
  requestHandler: RequestHandler = new RequestHandler(
    this.config.port,
    this.config.directory
  );

  async run(): Promise<boolean> {
    try {
      // Wait for app to be ready
      await app.whenReady().catch();

      // Registering handler
      ipcMain.handle("ip-address", () => address());
      ipcMain.handle("port", () => this.requestHandler.getPort());
      ipcMain.handle("directory", () => this.requestHandler.getDirectory());
      ipcMain.handle("select-directory", async () => {
        const dialogReturnValue = await dialog
          .showOpenDialog({
            properties: ["openDirectory"],
          })
          .catch(() => null);
        // Dialog can be cancelled
        if (!dialogReturnValue || dialogReturnValue.canceled) return;

        const directory = dialogReturnValue.filePaths[0] ?? process.cwd();

        this.requestHandler.setDirectory(directory);

        // Save to config
        const dir = this.requestHandler.getDirectory();
        this.config.directory = dir;
        this.fsHandler.writeConfig(this.config);

        // Send selected back to renderer
        return dir;
      });
      ipcMain.handle("set-port", (_, port: number) => {
        if (this.config.port === port) return port;

        try {
          this.requestHandler.stop();
          this.requestHandler = new RequestHandler(port, this.config.directory);

          // Save to config
          const p = this.requestHandler.getPort();
          this.config.port = p;
          this.fsHandler.writeConfig(this.config);

          return p;
        } catch (e) {
          Logger.generateErrorLog(
            new LocalStreamError("UNABLE_TO_RESTART_SERVER", e)
          );
          return null;
        }
      });

      // Create a new window
      this.mainWindow = new Window({
        width: 800,
        height: 600,
        webPreferences: {
          preload: _path.join(__dirname, "../struct/Preload.js"), // Js because compiled
        },
      });

      // Set menu null
      this.mainWindow.setMenu(null);

      // Load the home page of the app
      await this.mainWindow.loadFile(this.resolvePath("/html/index.html"));

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

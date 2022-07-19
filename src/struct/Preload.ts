import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  // Send to front end
  ipAddress: () => ipcRenderer.invoke("ip-address"),
  port: () => ipcRenderer.invoke("port"),

  directory: () => ipcRenderer.invoke("directory"),
  selectDirectory: (directory: string) =>
    ipcRenderer.invoke("select-directory", directory),

  // Response from front end
  setPort: (port: number) => ipcRenderer.invoke("set-port", port),
});

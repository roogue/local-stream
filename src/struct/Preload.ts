import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  ipAddress: () => ipcRenderer.invoke("ip-address"),
  port: () => ipcRenderer.invoke("port"),
})
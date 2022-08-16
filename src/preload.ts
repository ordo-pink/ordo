import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ordo", {
  emit: (event: string, payload: any) => ipcRenderer.send("ordo", { event, payload }),
});

ipcRenderer
  .on("@app/apply-patches", (_, detail) => window.dispatchEvent(new CustomEvent("@app/apply-patches", { detail })))
  .on("@app/set-state", (_, detail) => window.dispatchEvent(new CustomEvent("@app/set-state", { detail })));

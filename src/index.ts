import { app, BrowserWindow, Menu, protocol } from "electron";
import { enforceMacOSAppLocation, is, setContentSecurityPolicy } from "electron-util";

import { createWindow } from "@core/window/create-window";

if (require("electron-squirrel-startup")) {
  app.quit();
}

if (!is.development) {
  setContentSecurityPolicy(`
script-src 'self' ordo-app;
img-src * data: file:;
style-src 'unsafe-inline', ordo-app data: file:;
font-src 'self', ordo-app file:;
connect-src 'self', ordo-app;
base-uri 'none';
frame-src https://www.youtube.com;
form-action 'none';
frame-ancestors 'none';
object-src 'none';
`);
} else {
  setContentSecurityPolicy(`img-src * data: file:; frame-src *;`);
}

app.on("ready", async () => {
  enforceMacOSAppLocation();

  protocol.registerFileProtocol("ordo-app", (req, cb) => {
    const url = req.url.replace("ordo-app://open-file/", "");

    try {
      return cb(url);
    } catch (e) {
      console.error(e);
    }
  });

  if (is.macos) {
    const dockMenu = Menu.buildFromTemplate([
      { type: "separator" },
      {
        label: "New Window",
        click: () => createWindow(),
      },
    ]);

    app.dock.setMenu(dockMenu);
  }

  await createWindow();
});

app.on("window-all-closed", () => {
  if (!is.macos) {
    app.quit();
  }
});

app.on("activate", async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    await createWindow();
  }
});

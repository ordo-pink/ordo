import { BrowserWindow, dialog, app, clipboard, shell, ipcMain, globalShortcut, nativeTheme, Menu } from "electron";
import install, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from "electron-devtools-installer";
import { is, centerWindow } from "electron-util";

import { internalSettingsStore } from "@core/settings/internal-settings";
import { Transmission } from "@core/transmission";
import { saveWindowPosition } from "@core/window/save-window-position";
import { initEvents } from "@init/events";
import { initCommands } from "@init/commands";
import { initialState } from "@init/state";
import { WindowContext } from "@init/types";
import { userSettingsStore } from "@core/settings/user-settings";
import { getApplicationMenu } from "@core/application-menu";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const windows = new Set<BrowserWindow>();

/**
 * Creates a new BrowserWindow. Every window has its own separate state.
 */
export const createWindow = async (): Promise<void> => {
  if (process.argv.includes("--debug") && is.development) {
    await install([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS]);
  }

  nativeTheme.themeSource = userSettingsStore.get("appearance.theme") || "system";

  let window: BrowserWindow = new BrowserWindow({
    show: false,
    height: internalSettingsStore.get("window.height"),
    width: internalSettingsStore.get("window.width"),
    x: internalSettingsStore.get("window.position.x"),
    y: internalSettingsStore.get("window.position.y"),
    icon: "assets/icon.png",
    // titleBarStyle: "hiddenInset",
    acceptFirstMouse: true,
    webPreferences: {
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
      allowRunningInsecureContent: false,
      accessibleTitle: "Ordo",
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  if (windows.size > 0) {
    centerWindow({ window });
  }

  window.on("resized", () => saveWindowPosition(window));
  window.on("moved", () => saveWindowPosition(window));
  window.on("close", () => {
    windows.delete(window);
    window = null as any;
  });

  window.on("ready-to-show", () => {
    window.show();
  });

  windows.add(window);

  const context: WindowContext = {
    window,
    dialog,
    addRecentDocument: (path) => {
      app.addRecentDocument(path);
    },
    toClipboard: (content) => {
      clipboard.writeText(content);
    },
    fromClipboard: clipboard.readText,
    showInFolder: shell.showItemInFolder,
    trashItem: shell.trashItem,
  };

  const transmission = new Transmission(initialState, context);

  initEvents(transmission);

  ipcMain.on("ordo", (_, { event, payload }) => transmission.emit(event, payload));

  await initCommands(transmission);

  Menu.setApplicationMenu(getApplicationMenu(transmission));

  window.on("blur", () => {
    transmission.emit("@editor/unfocus", null);
  });

  window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

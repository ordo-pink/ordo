import { app, Menu, shell } from "electron";
import { join } from "path";
import { existsSync, promises } from "fs";

import { Transmission } from "@core/transmission";

const separator = { type: "separator" };

export const getApplicationMenu = (transmission: Transmission) => {
  const platform = transmission.select((state) => state.app.internalSettings.platform);

  const macMenu =
    platform === "darwin"
      ? [
          {
            label: "Ordo",
            submenu: [
              { role: "about" },
              separator,
              { role: "services" },
              separator,
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              separator,
              { role: "quit" },
            ],
          },
        ]
      : [];

  return Menu.buildFromTemplate(
    macMenu.concat([
      {
        label: "&File",
        submenu: [
          {
            label: "Create File",
            accelerator: "CommandOrControl+N",
            click: () =>
              transmission.emit(
                "@file-explorer/show-file-creation",
                transmission.select((state) => state.fileExplorer.tree.path),
              ),
          },
          {
            label: "Create Folder",
            accelerator: "CommandOrControl+Shift+N",
            click: () =>
              transmission.emit(
                "@file-explorer/show-folder-creation",
                transmission.select((state) => state.fileExplorer.tree.path),
              ),
          },
          separator,
          {
            label: "Open Folder",
            accelerator: "CommandOrControl+O",
            click: () => transmission.emit("@app/select-project", null),
          },
          {
            role: "recentDocuments",
            submenu: [
              {
                role: "clearRecentDocuments",
              },
            ],
          },
          separator,
          {
            label: "Close Tab",
            accelerator: "CommandOrControl+W",
            click: () => transmission.emit("@editor/close-tab", null),
          },
          {
            label: "Close Window",
            accelerator: "CommandOrControl+Shift+W",
            click: () => transmission.emit("@app/close-window", null),
          },
        ] as any[],
      },
      {
        label: "&Edit",
        submenu: [
          {
            label: "Undo",
            accelerator: "CommandOrControl+Z",
            click: () => transmission.emit("@app/undo", null),
          },
          {
            label: "Redo",
            accelerator: "CommandOrControl+Shift+Z",
            click: () => transmission.emit("@app/redo", null),
          },
          separator,
          // {
          //   label: "Cut",
          //   accelerator: "CommandOrControl+X",
          //   click: () => transmission.emit("@editor/cut", null);
          // },
          {
            label: "Copy",
            accelerator: "CommandOrControl+C",
            click: () => transmission.emit("@editor/copy", null),
          },
          {
            label: "Paste",
            accelerator: "CommandOrControl+V",
            click: () => transmission.emit("@editor/paste", null),
          },
          separator,
          {
            label: "Find",
            accelerator: "CommandOrControl+F",
            click: () => transmission.emit("@top-bar/open-search-in-file", null),
          },
          separator,
          {
            label: "Select All",
            accelerator: "CommandOrControl+Shift+A",
            click: () => transmission.emit("@editor/select-all", null),
          },
          separator,
          {
            label: "Copy Path",
            accelerator: "CommandOrControl+Alt+C",
            click: () => transmission.emit("@file-explorer/copy-path", null),
          },
          {
            label: "Reveal in Files",
            accelerator: "CommandOrControl+Alt+R",
            click: () => transmission.emit("@file-explorer/reveal-in-finder", null),
          },
          {
            label: "Rename",
            accelerator: "Shift+F2",
            click: () => transmission.emit("@file-explorer/rename", null),
          },
          ...(platform === "darwin"
            ? [
                {
                  label: "Speech",
                  submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
                },
              ]
            : []),
        ],
      },
      {
        label: "&View",
        submenu: [
          { role: "reload" },
          { role: "forceReload" },
          { role: "toggleDevTools" },
          separator,
          { role: "resetZoom" },
          { role: "zoomIn" },
          { role: "zoomOut" },
          separator,
          { role: "toggleFullScreen" },
          separator,
          {
            label: "Editor",
            accelerator: "CommandOrControl+Shift+E",
            click: () => transmission.emit("@activity-bar/open-editor", null),
          },
          {
            label: "Graph",
            accelerator: "CommandOrControl+Shift+G",
            click: () => transmission.emit("@activity-bar/open-graph", null),
          },
          {
            label: "Checkboxes",
            accelerator: "CommandOrControl+Shift+C",
            click: () => transmission.emit("@activity-bar/open-checkboxes", null),
          },
          {
            label: "Settings",
            accelerator: "CommandOrControl+,",
            click: () => transmission.emit("@activity-bar/open-settings", null),
          },
          separator,
          {
            label: "Go to Line",
            accelerator: "Alt+Shift+G",
            click: () => transmission.emit("@top-bar/open-go-to-line", null),
          },
          {
            label: "Go to File",
            accelerator: "CommandOrControl+P",
            click: () => transmission.emit("@top-bar/open-go-to-file", null),
          },
          {
            label: "Go to Commands",
            accelerator: "CommandOrControl+Shift+P",
            click: () => transmission.emit("@top-bar/open-command-palette", null),
          },
          {
            label: "Go to Welcome Page",
            accelerator: "CommandOrControl+Alt+W",
            click: () => transmission.emit("@activity-bar/select", "WelcomePage"),
          },
          separator,
          {
            label: "Toggle Sidebar",
            accelerator: "CommandOrControl+Shift+B",
            click: () => transmission.emit("@side-bar/toggle", null),
          },
        ],
      },
      {
        label: "W&indow",
        submenu: [
          { role: "minimize" },
          { role: "zoom" },
          ...(platform === "darwin"
            ? [{ type: "separator" }, { role: "front" }, { type: "separator" }, { role: "window" }]
            : []),
        ],
      },
      {
        label: "&Help",
        submenu: [
          {
            label: "Website",
            click: () => shell.openExternal("https://ordo.pink"),
          },
          {
            label: "News and Updates",
            click: () => shell.openExternal("https://ordo.pink/blog"),
          },
          {
            label: "Tutorial",
            click: () => shell.openExternal("https://ordo.pink/blog/markdown-basics"),
          },
        ],
      },
    ]) as any,
  );
};

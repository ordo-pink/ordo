import { contextBridge } from "electron";
import { SettingsAPI, SETTINGS_API } from "./configuration/settings-renderer-api";
import { EditorAPI, EDITOR_API } from "./editor/editor-renderer-api";

contextBridge.exposeInMainWorld(EDITOR_API, EditorAPI);
contextBridge.exposeInMainWorld(SETTINGS_API, SettingsAPI);

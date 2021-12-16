import { contextBridge } from "electron";
import { EditorAPI, EDITOR_API } from "./editor/editor-renderer-api";

contextBridge.exposeInMainWorld(EDITOR_API, EditorAPI);

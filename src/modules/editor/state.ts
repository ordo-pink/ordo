import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";
import React from "react";
import { createDispatchHook, createSelectorHook, TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { Tab } from "./types";

type CaretPosition = {
	line: number;
	character: number;
};

type CaretRange = {
	start: CaretPosition;
	end: CaretPosition;
	direction: "ltr" | "rtl";
};

type EditorTab = Tab & {
	lines: string[];
	caretPositions: CaretRange[];
};

type EditorState = {
	tabs: EditorTab[];
};

export const initialState: EditorState = {
	tabs: [],
};

export const editorSlice = createSlice({
	name: "editor",
	initialState,
	reducers: {
		openTab: (state, action: PayloadAction<Tab>) => {
			state.tabs.push({
				path: action.payload.path,
				raw: action.payload.raw,
				lines: action.payload.raw.split("\n").map((line) => line.concat(" ")),
				caretPositions: [
					{
						start: { line: 0, character: 0 },
						end: { line: 0, character: 0 },
						direction: "ltr",
					},
				],
			});
		},
		closeTab: (state, action: PayloadAction<string>) => {
			const tabIndex = state.tabs.findIndex((t) => t.path === action.payload);
			tabIndex >= 0 && state.tabs.splice(tabIndex, 1);
		},
		handleTyping: (state, action: PayloadAction<{ path: string; event: KeyboardEvent }>) => {
			const tab = state.tabs.find((t) => t.path === action.payload.path);

			if (!tab) return;

			const currentLine = tab.lines[tab.caretPositions[0].start.line];

			if (
				action.payload.event.key === "Shift" ||
				action.payload.event.key === "Alt" ||
				action.payload.event.key === "Control" ||
				action.payload.event.key === "Escape" ||
				action.payload.event.key === "Insert" ||
				action.payload.event.key === "Meta" ||
				action.payload.event.key === "F1" ||
				action.payload.event.key === "F2" ||
				action.payload.event.key === "F3" ||
				action.payload.event.key === "F4" ||
				action.payload.event.key === "F5" ||
				action.payload.event.key === "F6" ||
				action.payload.event.key === "F7" ||
				action.payload.event.key === "F8" ||
				action.payload.event.key === "F9" ||
				action.payload.event.key === "F10" ||
				action.payload.event.key === "F11" ||
				action.payload.event.key === "F12" ||
				action.payload.event.key === "AltGraph" ||
				action.payload.event.key === "Tab" ||
				action.payload.event.key === "CapsLock" ||
				action.payload.event.key === "NumLock" ||
				action.payload.event.key === "PrintScreen" ||
				action.payload.event.key === "Pause"
			) {
				return;
			} else if (action.payload.event.key === "Delete") {
				tab.lines[tab.caretPositions[0].start.line] =
					tab.lines[tab.caretPositions[0].start.line].slice(0, tab.caretPositions[0].start.character) +
					tab.lines[tab.caretPositions[0].start.line].slice(tab.caretPositions[0].start.character + 1);
			} else if (action.payload.event.key === "Backspace") {
				tab.lines[tab.caretPositions[0].start.line] =
					tab.lines[tab.caretPositions[0].start.line].slice(0, tab.caretPositions[0].start.character - 1) +
					tab.lines[tab.caretPositions[0].start.line].slice(tab.caretPositions[0].start.character);
				tab.caretPositions[0].start.character--;
			} else if (action.payload.event.key === "Enter") {
				let lineContent = " ";

				lineContent = tab.lines[tab.caretPositions[0].start.line].slice(tab.caretPositions[0].start.character);

				tab.lines[tab.caretPositions[0].start.line] =
					tab.lines[tab.caretPositions[0].start.line].slice(
						0,
						tab.caretPositions[0].start.character ? tab.caretPositions[0].start.character : 0,
					) + " ";

				tab.lines.splice(tab.caretPositions[0].start.line + 1, 0, lineContent);

				tab.caretPositions[0].start.line++;
				tab.caretPositions[0].start.character = 0;
			} else {
				const newLine =
					currentLine.slice(0, tab.caretPositions[0].start.character) +
					(action.payload.event.shiftKey ? action.payload.event.key.toUpperCase() : action.payload.event.key) +
					currentLine.slice(tab.caretPositions[0].start.character);

				tab.lines[tab.caretPositions[0].start.line] = newLine;
				tab.caretPositions[0].start.character++;
				tab.caretPositions[0].end.character = tab.caretPositions[0].start.character;
			}

			window.ordo.emit("@file-explorer/save-file", { path: tab.path, content: [...tab.lines] });
		},
		updateCaretPositions: (state, action: PayloadAction<{ path: string; positions: CaretRange[] }>) => {
			const tab = state.tabs.find((t) => t.path === action.payload.path);
			tab && (tab.caretPositions = action.payload.positions);
		},
	},
});

export const editorStore = configureStore({
	reducer: {
		editor: editorSlice.reducer,
	},
});

export type EditorRootState = ReturnType<typeof editorStore.getState>;
export type EditorDispatch = typeof editorStore.dispatch;

export const { openTab, closeTab, handleTyping, updateCaretPositions } = editorSlice.actions;

export const editorContext = React.createContext(initialState);
export const useEditorDispatch = createDispatchHook<EditorDispatch>(editorContext as any);
export const useEditorSelector: TypedUseSelectorHook<EditorRootState> = createSelectorHook(editorContext as any);

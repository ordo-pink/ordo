import { produce } from "immer";

export type ApplicationState = {
	currentView: "editor" | "graph" | "settings";
	workingDirectory: string;
};

const initialState: ApplicationState = {
	currentView: "editor",
	workingDirectory: null,
};

let state: ApplicationState;

export const getState = (): ApplicationState => {
	if (!state) {
		state = { ...initialState };
	}

	return state;
};

export const setState = (callback: (state: ApplicationState) => unknown): void => {
	if (!state) {
		state = { ...initialState };
	}

	state = produce(state, callback);
};

import { WindowState } from "./types";

export const toReduxState = (state: WindowState) => ({
	editor: state.editor,
	explorer: state.explorer,
	appearance: state.appearance,
	statusBar: state.statusBar,
});

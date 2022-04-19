import { registerEvents } from "@core/transmission/register-ordo-events";
import { OrdoEvents } from "@init/types";
import { TopBarEvents } from "./types";

export default registerEvents<TopBarEvents>({
	"@top-bar/focus": ({ draft }) => {
		draft.topBar.focused = true;
	},
	"@top-bar/unfocus": ({ draft }) => {
		draft.topBar.value = "";
		draft.topBar.focused = false;
	},
	"@top-bar/toggle-focus": ({ draft, transmission }) => {
		const focused = transmission.select((state) => state.topBar.focused);

		draft.topBar.focused = !focused;
	},
	"@top-bar/set-value": ({ draft, payload }) => {
		draft.topBar.value = payload;
	},
	"@top-bar/open-command-palette": ({ draft }) => {
		draft.topBar.focused = true;
		draft.topBar.value = ">";
	},
	"@top-bar/open-search-in-file": ({ draft }) => {
		draft.topBar.focused = true;
		draft.topBar.value = "";
	},
	"@top-bar/open-go-to-line": ({ draft }) => {
		draft.topBar.focused = true;
		draft.topBar.value = ":";
	},
	"@top-bar/open-go-to-file": ({ draft }) => {
		draft.topBar.focused = true;
		draft.topBar.value = "@";
	},
	"@top-bar/run-command": ({ transmission, payload }) => {
		transmission.emit(payload as keyof OrdoEvents, null);
	},
});

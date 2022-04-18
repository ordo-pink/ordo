import { registerEvents } from "@core/transmission/register-ordo-events";
import { SideBarEvents } from "@containers/side-bar/types";
import { internalSettingsStore } from "@core/settings/internal-settings";

export default registerEvents<SideBarEvents>({
	"@side-bar/hide": ({ draft }) => {
		draft.sideBar.show = false;
	},
	"@side-bar/show": ({ draft, transmission }) => {
		draft.sideBar.show = true;

		const width = transmission.select((state) => state.sideBar.width);

		if (width <= 1) {
			draft.sideBar.width = 20;
		}
	},
	"@side-bar/toggle": ({ draft, transmission }) => {
		const { show, width } = transmission.select((state) => state.sideBar);

		draft.sideBar.show = !show;

		if (show && width <= 1) {
			draft.sideBar.width = 20;
		}
	},
	"@side-bar/set-width": ({ draft, payload }) => {
		draft.sideBar.width = payload;
		internalSettingsStore.set("window.sideBarWidth", payload);
	},
});

import { registerEvents } from "@core/transmission/register-ordo-events";
import { readFile } from "@modules/file-explorer/api/read-file";
import { OrdoFile } from "@modules/file-explorer/types";
import { EditorEvents } from "./types";

export default registerEvents<EditorEvents>({
	"@editor/open-tab": async ({ draft, payload, transmission }) => {
		const currentTab = transmission.select((state) => state.editor.currentTab);

		if (currentTab === payload) {
			return;
		}

		const tab = transmission.select((state) => state.editor.tabs.find((tab) => tab.path === payload));

		if (!tab) {
			const raw = await readFile(payload);

			draft.editor.tabs.push({
				raw,
				path: payload,
				ranges: [
					{
						start: {
							line: 1,
							character: 0,
						},
						end: {
							line: 1,
							character: 0,
						},
						direction: "ltr",
					},
				],
			} as OrdoFile);
		}

		draft.editor.currentTab = payload;
	},
	"@editor/close-tab": ({ draft, payload, transmission }) => {
		const currentTab = transmission.select((state) => state.editor.currentTab);
		const tabIndex = transmission.select((state) => state.editor.tabs.findIndex((tab) => tab.path === payload));
		const currentTabIndex = transmission.select((state) => state.editor.tabs.findIndex((tab) => tab.path === currentTab));

		if (currentTabIndex === -1 && tabIndex === -1) {
			return;
		}

		draft.editor.tabs.splice(tabIndex !== -1 ? tabIndex : currentTabIndex, 1);
		draft.editor.currentTab = draft.editor.tabs.length > 0 ? draft.editor.tabs[0].path : "";
	},
});

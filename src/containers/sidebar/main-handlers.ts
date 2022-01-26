import { registerEventHandlers } from "../../common/register-ipc-main-handlers";

export default registerEventHandlers({
	"@sidebar/set-component": ({ draft, passed }) => void (draft.sidebar.component = passed as string),
	"@sidebar/set-width": ({ draft, passed }) => void (draft.sidebar.width = passed as number),
	"@sidebar/show": ({ draft }) => void (draft.sidebar.width = 25),
	"@sidebar/hide": ({ draft }) => void (draft.sidebar.width = 0),
	"@sidebar/toggle": ({ draft }) => void (draft.sidebar.width = draft.sidebar.width > 0 ? 0 : 25),
});

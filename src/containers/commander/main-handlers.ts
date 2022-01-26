import { registerEventHandlers } from "../../common/register-ipc-main-handlers"

export default registerEventHandlers({
	"@commander/get-items": ({ draft, passed, state }) => {
		const appCommands = state.get((s) => s.application.commands)
		draft.commander.items = appCommands.filter((c) => c.name.startsWith(passed || ""))
	},
	"@commander/show": ({ draft, state }) => {
		draft.commander.show = true
		state.emit("@commander/get-items", "")
	},
	"@commander/hide": ({ draft }) => {
		draft.commander.show = false
	},
	"@commander/run": ({ draft, passed, state }) => {
		draft.commander.show = false
		state.emit(passed as string)
	},
	"@commander/toggle": ({ state }) => {
		state.emit(state.get((s) => s.commander.show) ? "@commander/hide" : "@commander/show")
	},
})

import {
	prependListener,
	appendListener,
	registerCommand,
	executeCommand,
	unregisterCommand,
} from "../streams/commands"

export const useCommands = () => ({
	before: prependListener,
	after: appendListener,
	on: registerCommand,
	emit: executeCommand,
	off: unregisterCommand,
})

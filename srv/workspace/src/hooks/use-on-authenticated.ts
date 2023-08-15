import { useEffect } from "react"
import { useAuthStatus } from "../streams/auth"
import { getCommands } from "$streams/commands"
import { AiOutlineAim } from "react-icons/ai"
import { useExtensions } from "../streams/extensions"
import Asdf from "./asdf"

const commands = getCommands()

export const useOnAuthenticated = () => {
	const isAuthenticated = useAuthStatus()
	const exts = useExtensions()

	useEffect(() => {
		if (!isAuthenticated) return

		// TODO: Remove
		exts.activities.add("test", {
			Component: Asdf,
			Icon: AiOutlineAim,
			routes: ["/asdf"],
		})

		commands.emit("core.refresh-user-info")
		commands.emit("core.refresh-metadata-root")
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated])
}

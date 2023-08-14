import { useEffect } from "react"
import {
	useAuthStatus,
	useUserAPIService0,
	useMetadataAPIService0,
	onBeforeQuit,
	Hosts,
} from "../streams/auth"
import { useCommands } from "./use-commands"
import { useCommandPalette } from "../streams/command-palette"
import { AiOutlineLogout, AiOutlineAim } from "react-icons/ai"
import { useExtensions } from "../streams/extensions"
import Asdf from "./asdf"

export const useOnAuthenticated = (hosts: Hosts) => {
	const isAuthenticated = useAuthStatus()
	const us0 = useUserAPIService0()
	const ms0 = useMetadataAPIService0()
	const commands = useCommands()
	const commandPalette = useCommandPalette()
	const exts = useExtensions()

	useEffect(() => {
		if (!isAuthenticated) return

		const handleRefreshUserInfo = () => void us0.chain(s => s.getCurrentUserAccount()).orNothing()
		const handleRefreshMetadataRoot = () => void ms0.chain(s => s.getRoot()).orNothing()
		const handleSignOut = () => {
			onBeforeQuit()
			commands.emit("router.open-external", { url: `${hosts.web}/sign-out`, newTab: false })
		}

		commandPalette.addItem({
			commandName: "core.sign-out",
			readableName: "Sign out",
			Icon: AiOutlineLogout,
			onSelect: () => commands.emit("core.sign-out"),
		})

		commands.on("core.refresh-user-info", handleRefreshUserInfo)
		commands.on("core.refresh-metadata-root", handleRefreshMetadataRoot)
		commands.on("core.sign-out", handleSignOut)

		exts.activities.add("test", {
			Component: Asdf,
			Icon: AiOutlineAim,
			routes: ["/asdf"],
		})

		commands.emit("core.refresh-user-info")
		commands.emit("core.refresh-metadata-root")

		return () => {
			commands.off("core.refresh-user-info", handleRefreshUserInfo)
			commands.off("core.refresh-metadata-root", handleRefreshMetadataRoot)
			commands.off("core.sign-out", handleSignOut)

			commandPalette.removeItem("core.sign-out")

			exts.activities.remove("test")
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated])
}

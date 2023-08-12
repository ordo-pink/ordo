import { useEffect } from "react"
import { useAuthStatus, useUserAPIService0, useMetadataAPIService0, signOut } from "../streams/auth"
import { useCommands } from "./use-commands"
import {
	registerCommandPaletteItem,
	unregisterCommandPaletteItem,
} from "src/streams/command-palette"
import { AiOutlineLogout } from "react-icons/ai"

export const useOnAuthenticated = () => {
	const isAuthenticated = useAuthStatus()
	const us0 = useUserAPIService0()
	const ms0 = useMetadataAPIService0()
	const commands = useCommands()

	useEffect(() => {
		if (!isAuthenticated) return

		const handleRefreshUserInfo = () => void us0.chain(s => s.getCurrentUserAccount()).orNothing()
		const handleRefreshMetadataRoot = () => void ms0.chain(s => s.getRoot()).orNothing()

		registerCommandPaletteItem({
			id: "core.sign-out",
			name: "Sign out",
			Icon: AiOutlineLogout,
			onSelect: () => commands.emit("core.sign-out"),
		})

		commands.on("core.refresh-user-info", handleRefreshUserInfo)
		commands.on("core.refresh-metadata-root", handleRefreshMetadataRoot)
		commands.on("core.sign-out", signOut)

		commands.emit("core.refresh-user-info")
		commands.emit("core.refresh-metadata-root")

		return () => {
			commands.off("core.refresh-user-info", handleRefreshUserInfo)
			commands.off("core.refresh-metadata-root", handleRefreshMetadataRoot)
			commands.off("core.sign-out", signOut)

			unregisterCommandPaletteItem("core.sign-out")
		}
	}, [isAuthenticated])
}

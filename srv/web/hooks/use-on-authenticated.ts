import { useEffect } from "preact/hooks"
import {
	useAuthStatus,
	useUserAPIService0,
	useMetadataAPIService0,
	signOut,
} from "../streams/auth.ts"
import { registerCommand, executeCommand, unregisterCommand } from "../streams/commands.ts"

export const useOnAuthenticated = () => {
	const isAuthenticated = useAuthStatus()
	const us0 = useUserAPIService0()
	const ms0 = useMetadataAPIService0()

	useEffect(() => {
		if (!isAuthenticated) return

		const handleRefreshUserInfo = () => us0.chain(s => s.getCurrentUserAccount()).orNothing()
		const handleRefreshMetadataRoot = () => ms0.chain(s => s.getRoot()).orNothing()

		registerCommand("core.refresh-user-info", handleRefreshUserInfo)
		registerCommand("core.refresh-metadata-root", handleRefreshMetadataRoot)
		registerCommand("core.sign-out", signOut)

		executeCommand("core.refresh-user-info")
		executeCommand("core.refresh-metadata-root")

		return () => {
			unregisterCommand("core.refresh-user-info", handleRefreshUserInfo)
			unregisterCommand("core.refresh-metadata-root", handleRefreshMetadataRoot)
			unregisterCommand("core.sign-out", signOut)
		}
	}, [isAuthenticated])
}

import { Hosts } from "../streams/auth.ts"
import { useAppInit } from "../hooks/use-app-init.ts"
import ActivityBar from "../components/activity-bar/activity-bar.tsx"
import { useOnAuthenticated } from "../hooks/use-on-authenticated.ts"
import Sidebar from "../components/sidebar.tsx"
import { useSidebar } from "../streams/sidebar.ts"

export default function App({ idHost, dataHost }: Hosts) {
	useAppInit({ idHost, dataHost })
	useOnAuthenticated()

	const sidebar = useSidebar()

	return (
		<div class="flex">
			<ActivityBar activities={[{ name: "file-explorer", version: "0.1.0", background: false }]} />
			{sidebar.disabled ? (
				<div class="max-h-screen h-full flex overflow-auto w-full">
					NO SIDEBAR
					{/* <Button onClick={() => executeCommand("core.sign-out")}>Sign out</Button> */}
				</div>
			) : (
				<>
					<Sidebar />
					<div class="max-h-screen h-full flex overflow-auto w-full">
						SIDEBAR
						{/* <Button onClick={() => executeCommand("core.sign-out")}>Sign out</Button> */}
					</div>
				</>
			)}
		</div>
	)
}

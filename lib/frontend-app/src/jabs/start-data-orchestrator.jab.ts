import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { Switch } from "@ordo-pink/switch"
import { type TMaokaJab } from "@ordo-pink/maoka"
import { noop } from "@ordo-pink/tau"

import { DataManager } from "../frontend-app.data-manager"

type P = { metadata: Ordo.Metadata.Repository; content: Ordo.Content.Repository }
export const start_data_orchestrator =
	(repositories: P): TMaokaJab =>
	async ({ use, on_unmount }) => {
		const commands = use(MaokaOrdo.Jabs.get_commands)

		const data_manager = DataManager.Of(repositories.metadata, repositories.content)

		await data_manager.start(state_change =>
			Switch.Match(state_change)
				.case("get-remote", () => commands.emit("cmd.application.background_task.start_loading"))
				.case("put-remote", () => commands.emit("cmd.application.background_task.start_saving"))
				.case("get-remote-complete", () => commands.emit("cmd.application.background_task.reset_status"))
				.case("put-remote-complete", () => commands.emit("cmd.application.background_task.reset_status"))
				.default(noop),
		)

		on_unmount(() => {
			data_manager.cancel()
		})
	}

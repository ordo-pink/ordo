/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Maoka } from "@ordo-pink/oss-maoka"
import type { Zags } from "@ordo-pink/oss-zags"

export const fa_commands =
	(fa$: Zags.Instance<OrdoClient.FileAssociation.State>): Maoka.Jab =>
	({ use }) => {
		const handle_add: OrdoClient.Command.GunFor<"@ordo/main.file_association.add"> = instance =>
			fa$.update("fa", fas => (fas.some(i => i.id === instance.id) ? fas : [...fas, instance]))
		const handle_remove: OrdoClient.Command.GunFor<"@ordo/main.file_association.delete"> = id =>
			fa$.update("fa", fas => fas.filter(i => i.id !== id))

		use(ordo_client_maoka.jabs.handle_command("@ordo/main.file_association.add", handle_add))
		use(ordo_client_maoka.jabs.handle_command("@ordo/main.file_association.delete", handle_remove))
	}

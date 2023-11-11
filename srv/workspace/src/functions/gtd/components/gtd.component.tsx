// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useSharedContext } from "@ordo-pink/frontend-core"
import { Either } from "@ordo-pink/either"
import { Switch } from "@ordo-pink/switch"
import { Loading } from "$components/loading/loading"
import GTDInbox from "./gtd-inbox.component"
import GTDLabel from "./gtd-label.component"
import GTDProject from "./gtd-project.component"
import { useRouteParams } from "$hooks/use-route-params.hook"
import { FSID } from "@ordo-pink/data"
import GTDSubtasks from "./gtd-subtasks.component"

export default function GTD() {
	const { route } = useSharedContext()
	const { fsid, label, project } = useRouteParams<{ fsid: FSID; label: string; project: string }>()

	return Either.fromNullable(route).fold(Loading, route =>
		Switch.of(true)
			.case(!!label, () => <GTDLabel label={label!} />)
			.case(!!project, () => <GTDProject project={project!} />)
			.case(!!fsid, () => <GTDSubtasks fsid={fsid!} />)
			.default(() => <GTDInbox />),
	)
}

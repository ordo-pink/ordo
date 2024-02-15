// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useCurrentRoute, useRouteParams } from "@ordo-pink/frontend-react-hooks"
import { Either } from "@ordo-pink/either"
import { FSID } from "@ordo-pink/data"
import { Switch } from "@ordo-pink/switch"

import Loading from "@ordo-pink/frontend-react-components/loading-page"

import GTDInbox from "../components/inbox.component"
import GTDLabel from "../components/label.component"
import GTDSubtasks from "../components/subtasks.component"

export default function GTD() {
	const route = useCurrentRoute()
	const { fsid, label } = useRouteParams<{ fsid: FSID; label: string }>()

	return Either.fromNullable(route).fold(Loading, () =>
		Switch.empty()
			.case(!!label, () => <GTDLabel label={label!} />)
			.case(!!fsid, () => <GTDSubtasks fsid={fsid!} />)
			.default(() => <GTDInbox />),
	)
}

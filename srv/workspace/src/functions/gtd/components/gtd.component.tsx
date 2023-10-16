// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useSharedContext } from "@ordo-pink/frontend-core"
import { Either } from "@ordo-pink/either"
import { Switch } from "@ordo-pink/switch"
import { Loading } from "$components/loading/loading"
import GTDInbox from "./gtd-inbox.component"
import GTDLabel from "./gtd-label.component"
import GTDProject from "./gtd-project.component"

export default function GTD() {
	const { route } = useSharedContext()

	return Either.fromNullable(route).fold(Loading, route =>
		Switch.of(true)
			.case(!!route.params?.label, () => <GTDLabel label={route.params?.label} />)
			.case(!!route.params?.project, () => <GTDProject project={route.params?.project} />)
			.default(() => <GTDInbox />),
	)
}

// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import Null from "$components/null"
import { Either } from "@ordo-pink/either"
import { useSharedContext } from "@ordo-pink/frontend-core"

export default function FileExplorerCardComponent() {
	const { metadata } = useSharedContext()

	return Either.fromNullable(metadata).fold(Null, items => (
		<div className="w-full h-full flex items-center justify-center">
			<h1>TODO: Recent files, favourite files</h1>
		</div>
	))
}

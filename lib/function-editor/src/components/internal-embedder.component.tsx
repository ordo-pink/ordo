// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { BsFileEarmark, BsLayoutSidebar, BsThreeDots } from "react-icons/bs"
import { type RenderElementProps } from "slate-react"
import { useEffect } from "react"

import { chainE, fromNullableE, mapE } from "@ordo-pink/either"
import {
	useCommands,
	useContent,
	useDataByFSID,
	useStrictSubscription,
} from "@ordo-pink/frontend-react-hooks"
import { fileAssociations$ } from "@ordo-pink/frontend-stream-file-associations"

export default function InternalEmbedder({ children, element, attributes }: RenderElementProps) {
	const data = useDataByFSID((element as any).fsid)
	const commands = useCommands()
	// TODO: Extract to a hook
	const fileAssociations = useStrictSubscription(fileAssociations$, [])
	const content = useContent((element as any).fsid)

	const Assoc = fileAssociations.find(association => association.content_type === data?.contentType)

	useEffect(() => {
		if (!data) return

		commands.on(`editor-embedder.open-${data.fsid}`, () =>
			commands.emit<cmd.editor.open>("editor.open", data.fsid),
		)

		commands.emit<cmd.ctx_menu.add>("context-menu.add", {
			cmd: `editor-embedder.open-${data.fsid}`,
			Icon: BsLayoutSidebar,
			readableName: "Открыть в редакторе",
			shouldShow: ({ payload }) => payload === `editor-embedder-${data.fsid}`,
			type: "read",
		})

		return () => {
			commands.emit<cmd.ctx_menu.remove>("context-menu.remove", `editor-embedder.open-${data.fsid}`)
		}
	}, [element, commands, data])

	return fromNullableE(data)
		.pipe(chainE(data => fromNullableE(Assoc).pipe(mapE(({ Component }) => ({ data, Component })))))
		.fold(
			// TODO: Handle unable to
			renderChildren(children),
			({ Component, data }) => (
				<div
					{...attributes}
					contentEditable={false}
					className="rounded-lg bg-neutral-300 shadow-md dark:bg-neutral-800"
				>
					<div className="flex flex-wrap items-center justify-between rounded-t-lg bg-gradient-to-r from-neutral-200 via-neutral-200 to-sky-200 px-2 py-1 dark:from-neutral-700 dark:via-neutral-700 dark:!to-sky-900">
						<div className="flex items-center space-x-2">
							<div>{Assoc && Assoc.Icon ? <Assoc.Icon /> : <BsFileEarmark />}</div>
							<div>{data.name}</div>
						</div>

						<div>{children}</div>

						<div
							className="cursor-pointer px-2"
							title={`Управлять вложением "${data.name}"`}
							onClick={event => {
								commands.emit<cmd.ctx_menu.show>("context-menu.show", {
									event,
									payload: `editor-embedder-${data.fsid}`,
								})
							}}
						>
							<BsThreeDots />
						</div>
					</div>

					<Component
						data={data}
						is_editable={false}
						content={content}
						is_loading={content === null}
						is_embedded={true}
					/>
				</div>
			),
		)
}

// --- Internal ---

// TODO: Extract
function renderChildren({ children }: PropsWithChildren) {
	return function RenderProvidedChildren() {
		return <>{children}</>
	}
}

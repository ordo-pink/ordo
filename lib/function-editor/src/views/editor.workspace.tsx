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

import { ComponentType, useEffect, useState } from "react"

import { chainE, fixE, fromNullableE, mapE } from "@ordo-pink/either"
import {
	useCommands,
	useContent,
	useDataByFSID,
	useRouteParams,
	useStrictSubscription,
} from "@ordo-pink/frontend-react-hooks"
import { FSID } from "@ordo-pink/data"

import CenteredPage from "@ordo-pink/frontend-react-components/centered-page"

import Null from "@ordo-pink/frontend-react-components/null"
import { noop } from "@ordo-pink/tau"

import DataEditor from "../components/data-editor.component"
import EditableTitle from "../components/editable-title.component"
import Loader from "@ordo-pink/frontend-react-components/loader"
import { fileAssociations$ } from "@ordo-pink/frontend-stream-file-associations"

export default function EditorWorkspace() {
	const [isLoading, setIsLoading] = useState(true)

	const commands = useCommands()

	const { fsid } = useRouteParams<{ fsid: FSID }>()

	const [Editor, setEditor] = useState<ComponentType<Extensions.FileAssociationComponentProps>>(
		() => EditorLoader,
	)

	const data = useDataByFSID(fsid)
	const content = useContent(fsid)

	const [prevFsid, setPrevFsid] = useState<FSID>()
	const fileAssociations = useStrictSubscription(fileAssociations$, [])

	useEffect(() => {
		commands.emit<cmd.application.setTitle>(
			"application.set-title",
			data ? `${data.name} | Редактор` : "Редактор",
		)

		fromNullableE(data)
			.pipe(
				chainE(data =>
					fromNullableE(
						fileAssociations.find(
							fileAssociation =>
								fileAssociation.contentType === data.contentType || !data.contentType,
						),
					),
				),
			)
			.pipe(mapE(({ Component }) => Component))
			.pipe(fixE(() => () => Null))
			.fold(noop, x => setEditor(x))
	}, [data, commands, fileAssociations])

	useEffect(() => {
		if (fsid !== prevFsid) {
			if (content == null) {
				setIsLoading(true)
				return
			}

			setPrevFsid(fsid)
			setIsLoading(false)
		}
	}, [fsid, prevFsid, content])

	return fromNullableE(data).fold(
		() => (
			<CenteredPage centerX centerY>
				<div className="px-12">
					Здесь будет редактор файла, если этот самый файл выбрать в сайдбаре слева.
				</div>
			</CenteredPage>
		),
		data => (
			<div className="flex size-full flex-col items-center p-2 pb-12">
				<div className="flex size-full flex-col space-y-3">
					<div className="mb-8 lg:pl-12">
						<DataEditor key={data.fsid} data={data} />

						<div>
							<EditableTitle data={data} />
						</div>
					</div>

					<Editor content={content} isLoading={isLoading} data={data} editable={true} />
				</div>
			</div>
		),
	)
}

const EditorLoader = () => (
	<div className="flex min-h-full flex-col items-center justify-center">
		<Loader size="l" />
	</div>
)

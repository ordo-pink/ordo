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

import { ChangeEvent, useEffect, useState } from "react"
import { Subject, debounce, timer } from "rxjs"

import { FSID, PlainData } from "@ordo-pink/data"
import { useCommands } from "@ordo-pink/frontend-react-hooks"

type P = { data: PlainData }
export default function EditableTitle({ data }: P) {
	const commands = useCommands()
	const [title, setTitle] = useState(data.name)

	useEffect(() => {
		setTitle(data.name)
	}, [data.name])

	useEffect(() => {
		const subscription = debounceSave$.subscribe(({ fsid, value }) => {
			commands.emit<cmd.data.rename>("data.rename", { fsid, name: value })
		})

		return () => {
			subscription.unsubscribe()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const onInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setTitle(event.target.value)
		save$.next({ fsid: data.fsid, value: event.target.value })
	}

	return (
		<textarea
			className="w-full resize-none overflow-hidden border-0 bg-transparent p-0 font-mono text-3xl font-bold focus:ring-0"
			value={title}
			cols={34}
			rows={Math.ceil(title.length / 34)}
			onChange={onInputChange}
		/>
	)
}

const save$ = new Subject<{ fsid: FSID; value: string }>()
const debounceSave$ = save$.pipe(debounce(() => timer(1000)))

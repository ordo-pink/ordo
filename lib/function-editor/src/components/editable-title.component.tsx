// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { ChangeEvent, useEffect, useState } from "react"
import { Subject, debounce, timer } from "rxjs"

import { FSID, PlainData } from "@ordo-pink/data"
import { useCommands } from "@ordo-pink/frontend-react-hooks"

type P = { data: PlainData }
export default function EditableTitle({ data }: P) {
	const commands = useCommands()
	const [title, setTitle] = useState(data.name)

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

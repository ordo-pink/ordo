import { FSID, PlainData } from "@ordo-pink/data"
import { cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { ChangeEvent, useEffect, useState } from "react"
import { Subject, debounce, timer } from "rxjs"

type P = { data: PlainData }
export default function EditableTitle({ data }: P) {
	const { commands } = useSharedContext()
	const [title, setTitle] = useState(data.name)

	useEffect(() => {
		const subscription = debounceSave$.subscribe(({ fsid, value }) => {
			commands.emit<cmd.data.rename>("data.rename", { fsid, name: value })
		})

		return () => {
			subscription.unsubscribe()
		}
	}, [])

	const onInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setTitle(event.target.value)
		save$.next({ fsid: data.fsid, value: event.target.value })
	}

	return (
		<textarea
			className="text-3xl font-mono font-bold w-full bg-transparent border-0 p-0 focus:ring-0 overflow-hidden resize-none"
			value={title}
			cols={31}
			rows={Math.ceil(title.length / 31)}
			onChange={onInputChange}
		/>
	)
}

const save$ = new Subject<{ fsid: FSID; value: string }>()
const debounceSave$ = save$.pipe(debounce(() => timer(1000)))

import { Excalidraw, MainMenu } from "@excalidraw/excalidraw"
import { Subject, debounce, timer } from "rxjs"
import { useEffect, useState } from "react"

import { useCommands, useIsDarkTheme } from "@ordo-pink/frontend-react-hooks"

import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"
import { FSID } from "@ordo-pink/data"

import "../../static/excalidraw.css"

export default function ExcalidrawEditor({
	content,
	fsid,
	isLoading,
}: Extensions.FileAssociationComponentProps) {
	const isDark = useIsDarkTheme()
	const commands = useCommands()

	const [items, setItems] = useState<readonly ExcalidrawElement[] | null>(null)

	useEffect(() => {
		const subscription = debounceSave$.subscribe(({ fsid, value }) => {
			commands.emit<cmd.data.setContent>("data.set-content", {
				fsid,
				content: JSON.stringify(value),
			})
		})

		return () => {
			subscription.unsubscribe()
		}
	}, [commands])

	useEffect(() => {
		if (!content || isLoading) return setItems(null)
	}, [content, isLoading])

	useEffect(() => {
		if (!fsid || !items) return

		save$.next({ fsid, value: items })
	}, [items, fsid, commands])

	return (
		<div className="h-full rounded-lg">
			<Excalidraw
				theme={isDark ? "dark" : "light"}
				UIOptions={{
					tools: { image: false },
					canvasActions: {
						changeViewBackgroundColor: false,
						export: false,
						loadScene: true,
						saveToActiveFile: false,
						toggleTheme: false,
					},
				}}
				initialData={{ elements: content ? JSON.parse(content as string) : [] }}
				gridModeEnabled
				objectsSnapModeEnabled
				onChange={elements => setItems(elements)}
			>
				<MainMenu>
					<MainMenu.DefaultItems.SaveAsImage />
					<MainMenu.DefaultItems.Help />
					<MainMenu.DefaultItems.ClearCanvas />
				</MainMenu>
			</Excalidraw>
		</div>
	)
}

// --- Internal ---

const save$ = new Subject<{ fsid: FSID; value: any }>()
const debounceSave$ = save$.pipe(debounce(() => timer(1000)))

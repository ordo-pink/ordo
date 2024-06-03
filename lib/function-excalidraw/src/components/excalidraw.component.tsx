import { Excalidraw, MainMenu } from "@excalidraw/excalidraw"
import { Subject, debounce, timer } from "rxjs"
import { useEffect, useState } from "react"
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types"
import { equals } from "ramda"

import { useCommands, useIsDarkTheme } from "@ordo-pink/frontend-react-hooks"

import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"
import { FSID } from "@ordo-pink/data"

import "../../static/excalidraw.css"

export default function ExcalidrawEditor({
	content,
	editable,
	data,
	isLoading,
}: Extensions.FileAssociationComponentProps) {
	const isDark = useIsDarkTheme()
	const commands = useCommands()

	const [items, setItems] = useState<readonly ExcalidrawElement[]>([])
	const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null)

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
		if (!content || isLoading) {
			setItems([])
			excalidrawAPI?.updateScene({ elements: [] })
			return
		}

		const items = JSON.parse(content as string)
		setItems(items)
		excalidrawAPI?.updateScene({ elements: items })
	}, [content, isLoading, excalidrawAPI])

	useEffect(() => {
		if (!data || !items) return

		editable && save$.next({ fsid: data.fsid, value: items })
	}, [items, data.fsid, editable])

	return (
		<div className="h-full rounded-lg">
			<Excalidraw
				theme={isDark ? "dark" : "light"}
				viewModeEnabled={!editable}
				langCode="ru-RU"
				excalidrawAPI={api => setExcalidrawAPI(api)}
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
				initialData={{ elements: items, scrollToContent: true }}
				gridModeEnabled
				objectsSnapModeEnabled
				onChange={elements => {
					if (!equals(items, elements)) {
						setItems(elements)
					}
				}}
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

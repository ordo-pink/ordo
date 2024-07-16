import { type Dispatch, type SetStateAction, useEffect, useState } from "react"
import { Excalidraw, MainMenu } from "@excalidraw/excalidraw"
import {
	type ExcalidrawImperativeAPI,
	type ExcalidrawInitialDataState,
	type UIOptions,
} from "@excalidraw/excalidraw/types/types"
import { Subject, debounce, timer } from "rxjs"
import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"
import { equals } from "ramda"

import { useCommands, useIsDarkTheme } from "@ordo-pink/frontend-react-hooks"

import { chainE, fromBooleanE, fromNullableE, mapE, tapE } from "@ordo-pink/either"
import { extend, noop, omit } from "@ordo-pink/tau"
import { type FSID } from "@ordo-pink/data"

import "../../static/excalidraw.css"
import Null from "@ordo-pink/frontend-react-components/null"

export default function ExcalidrawEditor({
	data,
	content,
	is_loading: isLoading,
	is_editable: isEditable,
	is_embedded: isEmbedded,
}: Functions.FileAssociationComponentProps) {
	const isDark = useIsDarkTheme()
	const commands = useCommands()

	// --- State ---

	const [items, setItems] = useState<readonly ExcalidrawElement[]>([])
	const [isInitiallyRendered, setIsInitiallyRendered] = useState(false)
	const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null)

	// --- Effects ---

	useEffect(() => {
		const sub = debounceSave$.subscribe(({ fsid, content }) =>
			commands.emit<cmd.data.set_content>("data.content.set_content", { fsid, content }),
		)

		return () => sub.unsubscribe()
	}, [commands])

	useEffect(
		() =>
			fromNullableE(excalidrawAPI)
				.pipe(chainE(api => fromBooleanE(!isLoading, api)))
				.pipe(chainE(api => fromNullableE(content).pipe(mapE(content => ({ content, api })))))
				.pipe(mapE(({ content, api }) => ({ api, elements: JSON.parse(content as string) })))
				.pipe(tapE(({ elements }) => setItems(elements)))
				.pipe(chainE(params => fromBooleanE(!isInitiallyRendered, params)))
				.fold(noop, ({ api, elements }) => {
					api.updateScene({ elements })
					api.scrollToContent()

					setIsInitiallyRendered(true)
				}),
		[content, isLoading, excalidrawAPI, isInitiallyRendered],
	)

	// TODO: Handle shapes with `isDeleted: true`
	useEffect(
		() =>
			fromBooleanE(isEditable && !isEmbedded)
				.pipe(chainE(() => fromNullableE(data.fsid)))
				.pipe(chainE(fsid => fromBooleanE(!!items.length, { items, fsid })))
				.pipe(mapE(extend(({ items }) => ({ content: JSON.stringify(items) }))))
				.pipe(mapE(omit("items")))
				.fold(noop, payload => save$.next(payload)),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[items, data.fsid, isEditable, isEmbedded],
	)

	// --- Values ---

	const theme = isDark ? "dark" : "light"
	const langCode = "ru-RU" // TODO: i18n

	const handleCanvasChange = handleCanvasChangeUsing(items, setItems)

	const handleExcalidrawAPI = setExcalidrawAPI

	// TODO: Disallow embedding the same file
	return (
		<div className="h-full rounded-lg">
			<Excalidraw
				theme={theme}
				viewModeEnabled={!isEditable || isEmbedded}
				langCode={langCode}
				excalidrawAPI={handleExcalidrawAPI}
				UIOptions={uiOptions}
				initialData={initialData}
				objectsSnapModeEnabled
				autoFocus={isEditable && !isEmbedded}
				onChange={handleCanvasChange}
				validateEmbeddable={() => true}
			>
				{fromBooleanE(!isEmbedded).fold(Null, () => (
					<MainMenu>
						<MainMenu.DefaultItems.SaveAsImage />
						<MainMenu.DefaultItems.ClearCanvas />
						<MainMenu.Separator />
						<MainMenu.DefaultItems.Help />
					</MainMenu>
				))}
			</Excalidraw>
		</div>
	)
}

// --- Internal ---

type THandleCanvasChangeUsing = (
	is: readonly ExcalidrawElement[],
	setIs: Dispatch<SetStateAction<readonly ExcalidrawElement[]>>,
) => (es: readonly ExcalidrawElement[]) => void
const handleCanvasChangeUsing: THandleCanvasChangeUsing = (is, setIs) => es =>
	fromNullableE(es)
		.pipe(chainE(es => fromBooleanE(!equals(is, es), es)))
		.fold(noop, setIs)

const save$ = new Subject<{ fsid: FSID; content: string }>()
const debounceSave$ = save$.pipe(debounce(() => timer(1000)))

const initialData: Partial<ExcalidrawInitialDataState> = {
	elements: [],
	appState: { viewBackgroundColor: "transparent" },
}
const uiOptions: Partial<UIOptions> = {
	tools: { image: false },
	canvasActions: {
		changeViewBackgroundColor: false,
		export: false,
		loadScene: false,
		saveToActiveFile: false,
		toggleTheme: false,
		clearCanvas: false,
		saveAsImage: true,
	},
}

/* <button
				onClick={e => {
					function downloadURI(uri, name) {
						let link = document.createElement("a")
						link.download = name
						link.href = uri
						document.body.appendChild(link)
						link.click()
						document.body.removeChild(link)
						link = null
					}

					const url = document.querySelector("canvas")?.toDataURL("image/png", 0.9)
					downloadURI(url, `${data.name}.png`)
				}}
			>
				HIT ME
			</button> */

import { BehaviorSubject, map, merge, Observable, scan, shareReplay, Subject } from "rxjs"
import { IconType } from "react-icons"
import { BsCommand } from "react-icons/bs"
import { Binary, Curry, Nullable, Thunk, Unary, callOnce } from "#lib/tau/mod"
import { Logger } from "#lib/logger/mod"
import { getCommands } from "$streams/commands"

const commands = getCommands()

// TODO: Merge commands, command palette and context menu item creation

// --- Public ---

/**
 * Command palette item.
 */
export type CommandPaletteItem = {
	/**
	 * ID of the command to be invoked when the command palette item is used.
	 */
	id: string

	/**
	 * Readable name of the command palette item. Put a translated value here.
	 */
	readableName: string

	/**
	 * Action to be executed when command palette item is used.
	 */
	onSelect: Thunk<void>

	/**
	 * Icon to be displayed for the context menu item.
	 *
	 * @optional
	 */
	Icon?: IconType

	/**
	 * Keyboard accelerator for the context menu item. It only works while the context menu is
	 * opened.
	 *
	 * @optional
	 */
	accelerator?: string
}

// --- Internal ---

export type __CommandPalette$ = Observable<CommandPaletteItem[]>
export const __initCommandPalette: InitCommandPalette = callOnce(({ logger }) => {
	logger.debug("Initializing command palette")

	commands.on("command-palette.show", ({ payload }) => show(payload))
	commands.on("command-palette.add", ({ payload }) => add(payload))
	commands.on("command-palette.remove", ({ payload }) => remove(payload))
	commands.on("command-palette.hide", hide)

	add({
		id: "command-palette.hide",
		onSelect: hide,
		readableName: "Hide command palette",
		Icon: BsCommand,
		accelerator: "mod+shift+p",
	})

	return { globalCommandPalette$, currentCommandPalette$ }
})

type Add = Unary<CommandPaletteItem, void>
type Remove = Unary<string, void>
type Show = Unary<CommandPaletteItem[], void>
type Hide = Thunk<void>
type AddP = Curry<Binary<CommandPaletteItem, CommandPaletteItem[], CommandPaletteItem[]>>
type RemoveP = Curry<Binary<string, CommandPaletteItem[], CommandPaletteItem[]>>
type InitCommandPaletteP = { logger: Logger }
type InitCommandPaletteR = {
	globalCommandPalette$: Nullable<__CommandPalette$>
	currentCommandPalette$: Nullable<__CommandPalette$>
}
type InitCommandPalette = Unary<InitCommandPaletteP, InitCommandPaletteR>

const currentCommandPalette$ = new BehaviorSubject<CommandPaletteItem[]>([])

export const add: Add = item => add$.next(item)
export const remove: Remove = id => remove$.next(id)
export const show: Show = items => currentCommandPalette$.next(items)
export const hide: Hide = () => {
	currentCommandPalette$.next([])
	commands.emit("modal.hide")
}

const addP: AddP = item => state =>
	state.some(({ id: commandName }) => commandName === item.id) ? state : [...state, item]
const removeP: RemoveP = id => state => state.filter(a => a.id !== id)

const add$ = new Subject<CommandPaletteItem>()
const remove$ = new Subject<string>()
const globalCommandPalette$ = merge(add$.pipe(map(addP)), remove$.pipe(map(removeP))).pipe(
	scan((acc, f) => f(acc), [] as CommandPaletteItem[]),
	shareReplay(1)
)

globalCommandPalette$.subscribe()

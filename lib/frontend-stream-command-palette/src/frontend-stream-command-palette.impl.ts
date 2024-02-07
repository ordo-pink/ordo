import { BehaviorSubject } from "rxjs/internal/BehaviorSubject"
import { Subject } from "rxjs/internal/Subject"
import { map } from "rxjs/internal/operators/map"
import { merge } from "rxjs/internal/observable/merge"
import { scan } from "rxjs/internal/operators/scan"
import { shareReplay } from "rxjs/internal/operators/shareReplay"

import { callOnce } from "@ordo-pink/tau"
import { getCommands } from "@ordo-pink/frontend-stream-commands"
import { getLogger } from "@ordo-pink/frontend-logger"

export const __initCommandPalette = callOnce((fid: symbol) => {
	const commands = getCommands(fid)
	const logger = getLogger(fid)

	logger.debug("Initializing command palette...")

	commands.on<cmd.commandPalette.show>("command-palette.show", ({ payload }) => show(payload))
	commands.on<cmd.commandPalette.add>("command-palette.add", ({ payload }) => add(payload))
	commands.on<cmd.commandPalette.remove>("command-palette.remove", ({ payload }) => remove(payload))
	commands.on<cmd.commandPalette.hide>("command-palette.hide", () => {
		currentCommandPalette$.next({ items: [] })
		commands.emit<cmd.modal.hide>("modal.hide")
	})

	logger.debug("Initialized command palette.")
})

type CommandPaletteState = {
	items: Client.CommandPalette.Item[]
	onNewItem?: (newItem: string) => any
	multiple?: boolean
	pinnedItems?: Client.CommandPalette.Item[]
}

type Add = (item: Client.CommandPalette.Item) => void
type Remove = (id: string) => void
type Show = (state: CommandPaletteState) => void
type AddP = (
	item: Client.CommandPalette.Item,
) => (state: CommandPaletteState) => CommandPaletteState
type RemoveP = (item: string) => (state: CommandPaletteState) => CommandPaletteState

export const currentCommandPalette$ = new BehaviorSubject<CommandPaletteState>({ items: [] })

export const add: Add = item => add$.next(item)
export const remove: Remove = id => remove$.next(id)
export const show: Show = items => currentCommandPalette$.next(items)

const addP: AddP = item => state =>
	state.items.some(({ id: commandName }) => commandName === item.id)
		? state
		: { ...state, items: [...state.items, item] }
const removeP: RemoveP = id => state => ({
	...state,
	items: state.items.filter(a => a.id !== id),
})

const add$ = new Subject<Client.CommandPalette.Item>()
const remove$ = new Subject<string>()
export const globalCommandPalette$ = merge(add$.pipe(map(addP)), remove$.pipe(map(removeP))).pipe(
	scan((acc, f) => f(acc), { items: [] } as {
		items: Client.CommandPalette.Item[]
		onNewItem?: (newItem: string) => any
	}),
	shareReplay(1),
)

globalCommandPalette$.subscribe()

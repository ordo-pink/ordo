import { Identity } from "#lib/tau/mod.ts"
// PUBLIC ---------------------------------------------------------------------

// TYPES ----------------------------------------------------------------------

export type Iro = {
	red: Identity<string>
	green: Identity<string>
	yellow: Identity<string>
	blue: Identity<string>
	magenta: Identity<string>
	cyan: Identity<string>
	disabled: Identity<string>
	highlighted: Identity<string>
	bold: Identity<string>
	underline: Identity<string>
	inverse: Identity<string>
}

export type IroFn = (noColor?: boolean) => Iro

// IMPL -----------------------------------------------------------------------

/**
 * Enum of terminal decorations supported by Iro.
 */
export enum TerminalDecoration {
	RED = "\x1b[31m",
	GREEN = "\x1b[32m",
	YELLOW = "\x1b[33m",
	BLUE = "\x1b[34m",
	MAGENTA = "\x1b[35m",
	CYAN = "\x1b[36m",
	DISABLED = "\x1b[30m",
	HIGHLIGHTED = "\x1b[37m",
	BOLD = "\x1b[1m",
	UNDERLINE = "\x1b[4m",
	INVERSE = "\x1b[7m",
}

/**
 * A special symbol that resets styles.
 */
export const ASCII_EOL = "\x1b[0m"

/**
 * Iro applies styles to terminal output. The decorations supported by Iro are
 * listed in the `TerminalDecoration` enum. Iro does not apply decorations to
 * provided strings if the `noColor` argument is set to true.
 *
 * @param {boolean} noColor - skip applying decorations if set to `true`
 * @default false
 */
export const iro: IroFn = (noColor = false) => {
	const decorate = decorateOrReturn(noColor)

	return {
		red: decorate("RED"),
		green: decorate("GREEN"),
		yellow: decorate("YELLOW"),
		blue: decorate("BLUE"),
		magenta: decorate("MAGENTA"),
		cyan: decorate("CYAN"),
		disabled: decorate("DISABLED"),
		highlighted: decorate("HIGHLIGHTED"),
		bold: decorate("BOLD"),
		underline: decorate("UNDERLINE"),
		inverse: decorate("INVERSE"),
	}
}

// INTERNAL -------------------------------------------------------------------

// TYPES ----------------------------------------------------------------------

type DecorateOrReturn = (
	noColor: boolean
) => (
	decoration: keyof typeof TerminalDecoration
) => (message: string) => string

// IMPL -----------------------------------------------------------------------

/**
 * Applies decorations to provided string if `noColor` is set to `false`.
 */
const decorateOrReturn: DecorateOrReturn = noColor => decoration => message =>
	noColor ? message : `${TerminalDecoration[decoration]}${message}${ASCII_EOL}`

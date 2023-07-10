import type { Nullable } from "#lib/tau/mod.ts"
import type { TEither } from "#lib/either/mod.ts"

// Public ---------------------------------------------------------------------

/**
 * CLI configuration includes args and options provided by the user, as well as
 * the expectations defined for CLI builder.
 */
export type CLIConfig<
	Options extends Record<string, string | string[] | boolean> = Record<
		string,
		string | string[] | boolean
	> & { color?: "yes" | "no"; silent?: boolean; "dry-run"?: boolean }
> = {
	/**
	 * Arguments provided by the user.
	 */
	args: Record<string, string>

	/**
	 * Options provided by the user.
	 */
	options: Options

	/**
	 * Expectations defined for the CLI builder.
	 *
	 * @see {CLIBExpectations}
	 */
	expectations: CLIBExpectations
}

/**
 * CLIOption interface describes the way expectations about CLI options can be
 * defined.
 */
export type CLIOption = {
	/**
	 * Long option name.
	 *
	 * @example `--dry-run`
	 */
	long: `--${string}`

	/**
	 * Short option name. Must be in range [a-zA-Z].
	 *
	 * @example `-d`
	 * @default undefined
	 */
	short?: `-${string}`

	/**
	 * Possible values of the option. It is a record that expects value as a
	 * record key and description of the possible value as a record value. The
	 * description is used to create a help message.
	 *
	 * @example `{ yes: "Will work.", no: "Will not work." }`
	 * @default undefined
	 */
	values?: Record<string, string>

	/**
	 * Whether a value must be provided by the user. Setting this to `true` is
	 * mutually exclusive with `default`. If `inputRequired` is set to `true`,
	 * the `default` value is ignored.
	 *
	 * @default false
	 */
	inputRequired?: boolean

	/**
	 * The default value to be used if the value is not provided by the user.
	 * Setting `default` is mutually exclusive with setting `inputRequired` to
	 * `true`. If `inputRequired` is set to `true`, the `default` value is
	 * ignored.
	 *
	 * TODO: default
	 *
	 * @default undefined
	 * @example `no`
	 */
	default?: string

	/**
	 * Option description for the help message.
	 */
	description?: string

	/**
	 * Specifies whether repeating the option by the user should override the
	 * previous value or stack all provided values in a list. If a user calls
	 * the same option like `--color=yes --color=no`, setting this to `override`
	 * will result in `{ color: "no" }` whereas setting this to `extend` will
	 * result in `{ color: ["yes", "no"] }`.
	 *
	 * @default "override"
	 */
	onRepeat?: "override" | "extend"
}

/**
 * CLI argument interface.
 */
export type CLIArg = {
	/**
	 * Name of the argument.
	 */
	name: string

	/**
	 * Description of the argument used for creating a help message.
	 */
	description?: string
}

/**
 * CLI builder expectations interface describes the way expectations about CLI
 * expectations can be defined.
 */
export type CLIBExpectations = {
	/**
	 * A list of arguments expected by the program.
	 */
	args?: CLIArg[]

	/**
	 * A list of options expected by the program.
	 */
	options?: CLIOption[]

	/**
	 * Program name. Used for creating a help message.
	 */
	name: string

	/**
	 * Program description. Used for creating a help message.
	 */
	description?: string
}

/**
 * A list of arguments provided to the CLI application by the user.
 */
export type Argv = string[]

// Internal -------------------------------------------------------------------

export type TIsOption = (arg: string) => boolean

export type TEitherIsObject = (
	x: CLIBExpectations
) => TEither<CLIBExpectations, null>

export type TEitherNormalizeArgs = (x: {
	args: string[]
	expectations: CLIBExpectations
	options: CLIConfig["options"]
}) => TEither<CLIConfig, string>

export type TEitherGetOpts = (argv: Argv) => (
	expectations: CLIBExpectations
) => TEither<
	{
		args: string[]
		expectations: CLIBExpectations
		options: CLIConfig["options"]
	},
	string
>

export type TEitherCreateHelpMessage = (
	argv: Argv
) => (expectations: CLIBExpectations) => TEither<CLIBExpectations, string>

export type TProvideDefaultExpectations = (
	expectations: CLIBExpectations
) => CLIBExpectations

export type TCreateHelpMessage = (
	expectations: CLIBExpectations,
	ctx: { noColor: boolean; silent: boolean; dryRun: boolean }
) => string

export type TNormalizeLeft = (x: Nullable<string>) => string

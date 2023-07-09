import type {
	TEitherCreateHelpMessage,
	TEitherNormalizeArgs,
	CLIConfig,
	TEitherGetOpts,
	Argv,
	CLIBExpectations,
} from "./types.ts"

import { Either, TEither } from "#lib/either/mod.ts"
import { CLIBErrorString } from "./error-string.ts"
import { createHelpMessage } from "./create-help-message.ts"
import { eitherIsObject, isLongOption, isShortOption } from "./is.ts"

// Public ---------------------------------------------------------------------

/**
 * CLIB is a CLI builder tool. It accepts the argv and the expectations about
 * what the user is intended to provide. CLIB does some basic validation based
 * on the provided expectations, extracts arguments and options provided by the
 * user, and automatically handles cases when the user provides CLI-specific
 * options like `--dry-run`, `--silent`, `--color[=yes|no]`, etc.
 *
 * @param argv the list of arguments (e.g. from `process.env` or `Deno.args`).
 * @param expectations the definition of arguments and options of the program.
 * @returns {TEither<CLIConfig<Options>, string>}
 */
export const clib = <
	Options extends Record<string, string | string[] | boolean> = Record<
		string,
		string | string[] | boolean
	> & { dryRun: boolean; silent: boolean; noColor: boolean }
>(
	argv: Argv,
	expectations: CLIBExpectations
): TEither<CLIConfig<Options>, string> =>
	Either.fromNullable(expectations)
		.chain(eitherIsObject)
		.chain(eitherCreateHelpMessage(argv))
		.chain(eitherGetOpts(argv))
		.chain(eitherNormalizeArgs)
		.leftMap(x =>
			x != null ? x : CLIBErrorString.invalidExpectations()
		) as TEither<CLIConfig<Options>, string>

// Internal -------------------------------------------------------------------

const eitherCreateHelpMessage: TEitherCreateHelpMessage =
	argv => expectations =>
		Either.fromBooleanLazy(
			() => !argv.includes("--help"),
			() => expectations,
			() =>
				createHelpMessage(expectations, {
					// TODO: refactor and provide to Opts
					// TODO: Append to the end of the options description
					noColor: argv.includes("--color=no") || argv.includes("--no-color"),
					silent: argv.includes("--silent"),
					dryRun: argv.includes("--dry-run"),
				})
		)

const eitherNormalizeArgs: TEitherNormalizeArgs = opts =>
	Either.try(() => {
		const args = {} as CLIConfig["args"]

		if (opts.expectations.args && opts.expectations.args.length > 0) {
			for (let i = 0; i < opts.expectations.args.length; i++) {
				const argName = opts.expectations.args[i].name

				// Throw if the amount of provided arguments is less than expected
				if (!opts.args[i]) {
					throw CLIBErrorString.missingArgument(argName)
				}

				// Assign the argument to the opts
				args[argName] = opts.args[i]
			}
		}

		return {
			...opts,
			args,
		}
	})

const eitherGetOpts: TEitherGetOpts = providedArgv => expectations =>
	Either.try(() => {
		// TODO: Cleanup
		const args = [] as string[]
		const shortOptions = {} as CLIConfig["options"]
		const longOptions = {} as CLIConfig["options"]

		let argv = [...providedArgv]

		// Remove arguments provided after the `--`.
		if (~argv.indexOf("--")) argv = argv.slice(0, argv.indexOf("--"))

		for (let i = 0; i < argv.length; i++) {
			let argument = argv[i]

			if (isLongOption(argument)) {
				let value

				if (!expectations.options) continue

				if (~argument.indexOf("=")) {
					value = argument.slice(argument.indexOf("=") + 1)
					argument = argument.slice(0, argument.indexOf("="))
				}

				const expectation = expectations.options.find(
					exp => exp.long === argument
				)

				if (!expectation) continue

				if (expectation.inputRequired || expectation.values) {
					const nextArgument = argv[i + 1]

					if (
						!value &&
						expectation.inputRequired &&
						(isLongOption(nextArgument) ||
							isShortOption(nextArgument) ||
							i === argv.length - 1)
					) {
						if (expectation.default) {
							value = expectation.default
						} else {
							throw CLIBErrorString.missingRequiredLongOptionInput(argument)
						}
					}

					if (
						!value &&
						!isLongOption(nextArgument) &&
						!isShortOption(nextArgument) &&
						i !== argv.length - 1
					)
						value = argv[++i]

					if (!value && expectation.inputRequired) {
						if (expectation.default) {
							value = expectation.default
						} else {
							throw CLIBErrorString.missingRequiredLongOptionInput(argument)
						}
					}

					if (
						value &&
						expectation.values &&
						!Object.keys(expectation.values).includes(value)
					) {
						throw CLIBErrorString.invalidOptionValueProvided(value, expectation)
					}
				}

				longOptions[argument.slice(2)] = value ?? true
			} else if (isShortOption(argument)) {
				// TODO: Support for short options
			} else {
				if (!expectations.args) continue

				args.push(argument)
			}
		}

		return {
			args,
			expectations,
			options: {
				...shortOptions,
				...longOptions,
			},
		}
	})

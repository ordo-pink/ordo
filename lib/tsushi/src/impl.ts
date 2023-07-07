// deno-lint-ignore-file
import { Either } from "#lib/either/mod.ts"
import { isObject } from "#lib/tau/mod.ts"
import { CLIConfig } from "../../clib/mod.ts"
import { iro } from "../../iro/mod.ts"
import {
	ExpectFn,
	GroupFn,
	MergeFn,
	TestFn,
	TodoFn,
	Tsushi,
	TsushiConfig,
} from "./types.ts"

const TsushiError = {
	invalidTest: () =>
		"Invalid test: you probably forgot to return the expectation.",
	failed: (expected: any, got: any) => ({
		expected,
		got,
	}),
}

let config: TsushiConfig = {
	noColor: false,
	silent: false,
	skipTodo: false,
}

const expect: ExpectFn = x => ({
	toFail: async () =>
		Either.left(TsushiError.failed("inevitable fail", "fail")) as any,
	toPass: async () => Either.right(true),
	toBeArray: async () =>
		Either.fromBoolean(
			() => Array.isArray(x),
			true,
			TsushiError.failed("array", x)
		) as any,
	toBeBigInt: async () =>
		Either.fromBoolean(
			() => typeof x === "bigint",
			true,
			TsushiError.failed("bigint", typeof x)
		) as any,
	toBeBoolean: async () =>
		Either.fromBoolean(
			() => typeof x === "boolean",
			true,
			TsushiError.failed("boolean", typeof x)
		) as any,
	toBeDate: async () =>
		Either.fromBoolean(
			() => x instanceof Date,
			true,
			TsushiError.failed("Date", x)
		) as any,
	toEqual: async (y: any) =>
		Either.fromBoolean(() => x === y, true, TsushiError.failed(y, x)),
	toBeFalse: async () =>
		Either.fromBoolean(
			() => x === false,
			true,
			TsushiError.failed(false, x)
		) as any,
	toBeFalsy: async () =>
		Either.fromBoolean(() => !x, true, TsushiError.failed("falsy", x)) as any,
	toBeFunction: async () =>
		Either.fromBoolean(
			() => typeof x === "function",
			true,
			TsushiError.failed("function", typeof x)
		) as any,
	toBeInstanceOf: async (y: any) =>
		Either.fromBoolean(
			() => x instanceof y,
			true,
			TsushiError.failed(y, x)
		) as any,
	toBeNull: async () =>
		Either.fromBoolean(
			() => x === null,
			true,
			TsushiError.failed(null, x)
		) as any,
	toBeNullish: async () =>
		Either.fromBoolean(
			() => x == null,
			true,
			TsushiError.failed("null or undefined", x)
		) as any,
	toBeNumber: async () =>
		Either.fromBoolean(
			() => typeof x === "number",
			true,
			TsushiError.failed("number", typeof x)
		) as any,
	toBeObject: async () =>
		Either.fromBoolean(
			() => isObject(x),
			true,
			TsushiError.failed("object", x)
		) as any,
	toBeString: async () =>
		Either.fromBoolean(
			() => typeof x === "string",
			true,
			TsushiError.failed("string", typeof x)
		) as any,
	toBeSymbol: async () =>
		Either.fromBoolean(
			() => typeof x === "symbol",
			true,
			TsushiError.failed("symbol", typeof x)
		) as any,
	toBeTrue: async () =>
		Either.fromBoolean(
			() => x === true,
			true,
			TsushiError.failed(true, x)
		) as any,
	toBeTruthy: async () =>
		Either.fromBoolean(() => !!x, true, TsushiError.failed("truthy", x)) as any,
	toBeUndefined: async () =>
		Either.fromBoolean(
			() => typeof x === "undefined",
			true,
			TsushiError.failed(undefined, x)
		) as any,
})

const merge: MergeFn = async (...fs) => {
	let result = await fs[0]

	for (let i = 1; i < fs.length; i++) {
		const next = await fs[i]

		result = result.chain(() => next)
	}

	return result
}

const writeLog = (silent = false) =>
	silent
		? () => void 0
		: (message: string, isError = false) =>
				isError ? console.error(`${message}`) : console.log(`${message}`)

const test: TestFn =
	(parentTitle = "") =>
	async (title, callback, localConfig) => {
		const c = iro(config.noColor)
		const log = writeLog(config.silent || localConfig?.silent)

		try {
			const result = await callback({
				expect,
				merge,
				title: `${parentTitle} ${c.blue("→")} ${title}`,
			})

			if (!result || !result.isEither) {
				throw TsushiError.invalidTest()
			}

			result.fold(
				e =>
					log(
						`${c.red("✗")} ${parentTitle} ${c.blue("→")} ${title}
  ${c.red("→")} Expected: ${e.expected}
  ${c.red("→")} Got: ${e.got}`,
						true
					),
				() => log(`${c.green("✓")} ${parentTitle} ${c.blue("→")} ${title}`)
			)

			return result
		} catch (e) {
			log(`${c.red("✗")} ${e}`)

			return e
		}
	}

const todo: TodoFn =
	(parentTitle = "") =>
	title => {
		if (config.skipTodo) return

		const log = writeLog(config.silent)
		const c = iro(config && config.noColor)

		log(
			`${c.yellow("◌")} ${
				parentTitle ? `${parentTitle} ${c.blue("→")} ${title}` : `${title}`
			}`
		)
	}

const group: GroupFn =
	(parentTitle = "") =>
	async (title, callback) => {
		const c = iro(config && config.noColor)

		return callback({
			test: test(
				parentTitle ? `${parentTitle} ${c.blue("→")} ${title}` : title
			),
			group: group(
				parentTitle ? `${parentTitle} ${c.blue("→")} ${title}` : title
			),
			todo: todo(
				parentTitle ? `${parentTitle} ${c.blue("→")} ${title}` : title
			),
		})
	}

export const tsushi: Tsushi = configuration => {
	if (configuration) {
		config = configuration
	}

	return {
		test: test(),
		group: group(),
		todo: todo(),
	}
}

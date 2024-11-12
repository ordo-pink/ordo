// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

// deno-lint-ignore-file no-explicit-any

import type {
	TArrayToUnion,
	TOathIfExplosion,
	TRecordToUnion,
	TUnderOath,
	TUnderOathRejected,
} from "./oath.types.ts"
// deno-lint-ignore no-unused-vars
import type { invokers0 } from "./invokers.ts" // eslint-disable-line @typescript-eslint/no-unused-vars
// deno-lint-ignore no-unused-vars
import type { ops0 } from "./operators/mod.ts" // eslint-disable-line @typescript-eslint/no-unused-vars

/**
 * Oath is a dependency free package that introduces laziness, cancellation and
 * rejected branch types to your asynchronous code.
 */
export class Oath<$TResolve, $TReject = never> {
	/**
	 * Create an Oath that will resolve with provided value.
	 *
	 * @example
	 * ```typescript
	 * const yes0 = Oath.Resolve("yes")
	 *
	 * yes0
	 * 	.invoke(invokers0.to_promise)
	 * 	.then(console.log) // "yes"
	 * ```
	 */
	public static Resolve = <$TResolve, $TReject = never>(
		/**
		 * Value to resolve with.
		 */
		value: $TResolve,

		/**
		 * Optional abort controller for cases when Oath was cancelled when it already
		 * turned into a Promise.
		 *
		 * @optional
		 */
		abort_controller: AbortController = new AbortController(),
	): Oath<$TResolve, $TReject> => new Oath(resolve => resolve(value), abort_controller)

	/**
	 * Create an Oath that will resolve with provided value.
	 *
	 * @example
	 * ```typescript
	 * const no0 = Oath.Reject("no")
	 *
	 * no0
	 * 	.invoke(invokers0.to_promise)
	 * 	.catch(console.log) // "no"
	 * ```
	 */
	public static Reject = <$TReject, $TResolve = never>(
		/**
		 * Value to reject with.
		 *
		 * @optional
		 * @default undefined
		 */
		value?: $TReject,

		/**
		 * Optional abort controller for cases when Oath was cancelled when it already
		 * turned into a Promise.
		 *
		 * @optional
		 */
		abort_controller: AbortController = new AbortController(),
	): Oath<$TResolve, $TReject> => new Oath((_, reject) => reject(value), abort_controller)

	/**
	 * Create an Oath that will resolve if provided `predicate` is true and reject otherwise.
	 * Accepts optional `explosion` parameter which allows to define values to be resolved
	 * (`T`) or rejected (`F`). If the explosion does not provide corresponding value, the
	 * Oath will resolve/reject with `undefined`.
	 *
	 * @example
	 * ```typescript
	 * const maybe0 = Oath.If(Math.random() > 0.5, { T: () => "yes", F: () => "no"})
	 *
	 * maybe0
	 * 	.invoke(invokers0.force_resolve)
	 * 	.then(console.log) // Sometimes "yes", sometimes "no"
	 * ```
	 */
	public static If = <$TResolve = undefined, $TReject = undefined>(
		/**
		 * Predicate that defines whether the Oath should resolve or reject (`true` - resolve,
		 * `false` - reject).
		 */
		predicate: boolean,

		/**
		 * An "explosion" provided to the `Oath.If` as a second parameter to specify a value that
		 * should be resolved or rejected.
		 *
		 * @optional
		 * @default
		 * ```typescript
		 * { T: () => void, F: () => void }
		 * ```
		 */
		explosion?: TOathIfExplosion<$TResolve, $TReject>,

		/**
		 * Optional abort controller for cases when Oath was cancelled when it already
		 * turned into a Promise.
		 *
		 * @optional
		 */
		abort_controller: AbortController = new AbortController(),
	): Oath<$TResolve, $TReject> => {
		const T = explosion?.T ?? (() => void 0 as $TResolve)
		const F = explosion?.F ?? (() => void 0 as $TReject)

		return predicate ? Oath.Resolve(T(), abort_controller) : Oath.Reject(F(), abort_controller)
	}

	/**
	 * Create an empty Oath that will resolve (`Oath<void, never>`).
	 *
	 * @example
	 * ```typescript
	 * const undef = await Oath.Empty().invoke(invokers0.or_else(() => null))
	 * console.log(undef) // undefined
	 * ```
	 */
	public static Empty = <$TReject = never>(
		/**
		 * Optional abort controller for cases when Oath was cancelled when it already
		 * turned into a Promise.
		 *
		 * @optional
		 */
		abort_controller: AbortController = new AbortController(),
	): Oath<void, $TReject> => new Oath(resolve => resolve(undefined), abort_controller)

	/**
	 * Create an Oath of given value. If the value is `null` or `undefined`, the Oath rejects with
	 * a `null`. The Oath resolves with provided value otherwise. You can customise what the Oath
	 * rejects with by providing a `on_null` function as a second argument.
	 *
	 * @see {@link invokers0}
	 *
	 * @example
	 * ```typescript
	 * Oath.FromNullable("Hello, world!", () => "Goodbye, world!")
	 * 	.invoke(invokers0.force_resolve)
	 * 	.then(console.log) // "Hello, world!"
	 *
	 * Oath.FromNullable(null, () => "Goodbye, world!")
	 * 	.invoke(invokers0.force_resolve)
	 * 	.then(console.log) // "Goodbye, world!"
	 * ```
	 */
	public static FromNullable = <$TResolve, $TReject = null>(
		value: $TResolve | null,

		/**
		 * Define a value to be rejected with if the value provided to `Oath.FromNullable`
		 * was nullable.
		 *
		 * @optional
		 */
		on_null: () => $TReject = () => null as unknown as $TReject,

		/**
		 * Optional abort controller for cases when Oath was cancelled when it already
		 * turned into a Promise.
		 *
		 * @optional
		 */
		abort_controller: AbortController = new AbortController(),
	): Oath<NonNullable<$TResolve>, $TReject> =>
		value == null ? Oath.Reject(on_null(), abort_controller) : Oath.Resolve(value, abort_controller)

	/**
	 * Lazily create an Oath from given Promise. The Promise is not initialised if Oath is not
	 * invoked or forked. If the Promise rejects, the Oath rejects with the same value. If the
	 * Promise resolves, the Oath resolves with the same value. Since Promises do not provide
	 * rejected branch type definitions, it is up to the programmer to specify the Oath rejection
	 * type. {@link Oath.Try} has the same behavior if provided with a thunk returning a Promise.
	 *
	 * @example
	 * ```typescript
	 * Oath.FromPromise<Error | AggregateError>(() => promises.readFile("./package.json"))
	 *
	 * Oath.FromPromise(() => new Promise(resolve => resolve("Hello, world!")))
	 * ```
	 */
	public static FromPromise = <$TResolve, $TReject = Error>(
		/**
		 * A thunk of Promise that allows to lazily trigger the Promise only when Oath is invoked
		 * or forked.
		 */
		thunk: () => Promise<$TResolve>,

		/**
		 * Optional abort controller for cases when Oath was cancelled when it already
		 * turned into a Promise.
		 *
		 * @optional
		 */
		abort_controller: AbortController = new AbortController(),
	): Oath<$TResolve, $TReject> =>
		new Oath((resolve, reject) => thunk().then(resolve, reject), abort_controller)

	/**
	 * Create an Oath that will lazily execute the provided function and resolve if the function
	 * succeeded or reject if the function threw. If the provided function returns a Promise,
	 * `Oath.Try` works as {@link Oath.FromPromise}. Accepts an optional second parameter that
	 * overrides
	 *
	 * @see {@link Oath.FromPromise}
	 * @see {@link invokers0}.
	 *
	 * @example
	 * ```typescript
	 * Oath.Try(() => JSON.parse("{}"))
	 * 	.invoke(invokers0.or_else(() => null))
	 * 	.then(console.log) // {}
	 *
	 * Oath.Try(() => JSON.parse("}"))
	 * 	.invoke(invokers0.or_else(() => null))
	 * 	.then(console.log) // null
	 * ```
	 */
	public static Try = <$TResolve, $TReject = Error>(
		/**
		 * A function to be tried.
		 */
		thunk: () => $TResolve,

		/**
		 * Define a handler that overrides the caught error.
		 *
		 * @optional
		 */
		on_error = (error: unknown) =>
			error instanceof Error ? error : (new Error(String(error as any)) as any),

		/**
		 * Optional abort controller for cases when Oath was cancelled when it already
		 * turned into a Promise.
		 *
		 * @optional
		 */
		abort_controller: AbortController = new AbortController(),
	): Oath<Awaited<$TResolve>, $TReject> => {
		return new Oath(async (resolve, reject) => {
			try {
				// eslint-disable-next-line @typescript-eslint/await-thenable
				resolve(await thunk())
			} catch (error) {
				reject(on_error(error))
			}
		}, abort_controller)
	}

	/**
	 * Invert multiple Oaths of values into a single Oath of multiple values. Supports "synchronous"
	 * values, Promises, and Oaths. If any of the Promises or Oaths rejects - the result rejects with
	 * the value of the first encountered rejection. If all Promises or Oaths resolve - the result
	 * resolves with resolution of all values wrapped in the same structure they were provided. The
	 * provided values may be an array or a record.
	 *
	 * @todo Make two separate methods for arrays and records.
	 *
	 * @see {@link invokers0}
	 *
	 * @example
	 * ```typescript
	 * Oath.Merge([1, Promise.resolve(2), Oath.Resolve(3)])
	 * 	.invoke(invokers0.force_resolve)
	 * 	.then(console.log) // [1,2,3]
	 *
	 * Oath.Merge({
	 * 	ok: "OK",
	 * 	ok_promise: Promise.resolve("OK"),
	 * 	ok_oath: Oath.Resolve("OK"),
	 * })
	 * 	.invoke(invokers0.force_resolve)
	 * 	.then(console.log) // { ok: "OK", ok_promise: "OK", ok_oath: "OK" }
	 *
	 * Oath.Merge({ yes: true, no: Oath.Reject("NO! The Oath rejected!") })
	 * 	.invoke(invokers0.force_resolve)
	 * 	.then(console.log) // "NO! The Oath rejected!"
	 * ```
	 */
	public static Merge = <$TSomeThings extends readonly unknown[] | [] | Record<string, unknown>>(
		values: $TSomeThings,

		/**
		 * Optional abort controller for cases when Oath was cancelled when it already
		 * turned into a Promise.
		 *
		 * @optional
		 */
		abort_controller: AbortController = new AbortController(),
	): Oath<
		$TSomeThings extends []
			? { -readonly [P in keyof $TSomeThings]: TUnderOath<$TSomeThings[P]> }
			: { [P in keyof $TSomeThings]: TUnderOath<$TSomeThings[P]> },
		$TSomeThings extends Array<any>
			? TArrayToUnion<{ -readonly [P in keyof $TSomeThings]: TUnderOathRejected<$TSomeThings[P]> }>
			: TRecordToUnion<{ [P in keyof $TSomeThings]: TUnderOathRejected<$TSomeThings[P]> }>
	> => {
		if (!values || typeof values !== "object") throw new Error("Invalid merge values")

		let rejected = false

		if (Array.isArray(values)) {
			const resolved_values = [] as any[]
			let resolved_length = 0

			return new Oath((outer_resolve: any, outer_reject: any) => {
				if (!values.length) return outer_resolve([])

				values.forEach(value => {
					if (value.is_oath) {
						value.fork(
							(e: any) => {
								if (!rejected) {
									rejected = true
									outer_reject(e)
								}
							},
							(s: any) => {
								if (rejected) return

								resolved_values.push(s)
								resolved_length++

								if (resolved_length === values.length) outer_resolve(resolved_values)
							},
						)
					} else if (value.then) {
						value.then(
							(s: any) => {
								if (rejected) return
								resolved_values.push(s)
								resolved_length++

								if (resolved_length === values.length) outer_resolve(resolved_values)
							},
							(e: any) => {
								if (!rejected) {
									rejected = true
									outer_reject(e)
								}
							},
						)
					} else {
						resolved_values.push(value)
						resolved_length++
					}
				})
			}, abort_controller)
		} else {
			const resolved_values = {} as any
			let resolved_length = 0

			return new Oath((outer_resolve: any, outer_reject: any) => {
				const keys = Object.keys(values)
				if (!keys.length) return outer_resolve({})

				keys.forEach(key => {
					const value = (values as any)[key]

					if (value && value.is_oath) {
						value.fork(
							(e: any) => {
								if (!rejected) {
									rejected = true
									outer_reject(e)
								}
							},
							(s: any) => {
								if (rejected) return

								resolved_values[key] = s
								resolved_length++

								if (resolved_length === keys.length) outer_resolve(resolved_values)
							},
						)
					} else if (value && value.then) {
						value.then(
							(s: any) => {
								if (rejected) return

								resolved_values[key] = s
								resolved_length++

								if (resolved_length === keys.length) outer_resolve(resolved_values)
							},
							(e: any) => {
								if (!rejected) {
									rejected = true
									outer_reject(e)
								}
							},
						)
					} else {
						resolved_values[key] = value
						resolved_length++
						if (resolved_length === keys.length) outer_resolve(resolved_values)
					}
				})
			}, abort_controller)
		}
	}

	/**
	 * Abort controller for cases when Oath was cancelled when it already
	 * turned into a Promise.
	 */
	_abort_controller: AbortController

	/**
	 * Oath constructor and destructor, alpha and omega, yin and yang. You most probably don't need
	 * it. For smoother expericence, use {@link Oath.invoke} instead.
	 */
	cata: (
		resolved: <_TNewResolve>(value: $TResolve) => _TNewResolve,
		rejected: <_TNewReject>(err?: $TReject) => _TNewReject,
	) => any

	/**
	 * Instantiate an Oath the same way you would instantiate a new Promise. The difference
	 * from a Promise is that Oath is lazy and it will not run before you {@link Oath.invoke invoke}
	 * it.
	 *
	 * @constructor
	 *
	 * @see {@link invokers0}
	 *
	 * @example
	 * ```typescript
	 * new Oath((resolve, reject) => Math.random() > 0.5 ? resolve("beag") : reject("smol"))
	 * 	.invoke(invokers0.force_resolve)
	 * 	.then(console.log) // Sometimes "beag", sometimes "smol"
	 * ```
	 */
	public constructor(
		/**
		 * @see {@link Oath.cata}
		 */
		cata: (
			resolve: <_TNewResolve>(value: $TResolve) => _TNewResolve,
			reject: <_TNewReject>(err?: $TReject) => _TNewReject,
		) => any,

		/**
		 * Optional abort controller for cases when Oath was cancelled when it already
		 * turned into a Promise.
		 *
		 * @optional
		 */
		abortController: AbortController = new AbortController(),
	) {
		this.cata = cata
		this._abort_controller = abortController
	}

	/**
	 * Indeed it is an Oath.
	 *
	 * @readonly
	 */
	public get is_oath(): boolean {
		return true
	}

	/**
	 * Returns `true` if {@link Oath.cancel} was called.
	 *
	 * @readonly
	 */
	public get is_cancelled(): boolean {
		return this._abort_controller.signal.aborted
	}

	/**
	 * Returns the reason of cancellation provided to {@link Oath.cancel}. Returns `undefined`
	 * if the Oath was not cancelled.
	 *
	 * NOTE: It is better to check if the Oath was cancelled using `oath.is_cancelled`.
	 *
	 * @todo Preserve cancellation reason type
	 * @readonly
	 */
	public get cancellation_reason(): string | undefined {
		return this.is_cancelled ? this._abort_controller.signal.reason : undefined
	}

	/**
	 * Cancel the Oath. If the Oath has transformed to a Promise, the Promise will be cancelled
	 * with rejection via {@link AbortController} using the provided cancellation reason. If the
	 * Oath has not transformed to a Promise yet, it will reject any further operations and
	 * eventually reject as a Promise. Operators that handle rejected branch are ignored as well
	 * if the Oath was rejected.
	 *
	 * @see {@link Oath.and}
	 * @see {@link invokers0}
	 *
	 * @example
	 * ```tsx
	 * import React from "react"
	 *
	 * const Book = (id: string) => {
	 * 	const [book, set_book] = React.useState(null)
	 *
	 * 	React.useEffect(() => {
	 * 		const url = `https://test.api/books/${id}`
	 *
	 * 		const book0 = Oath.FromPromise(() => fetch(url))
	 * 			.and(res => Oath.FromPromise(() => res.json()))
	 * 			.and(book => set_book(book))
	 *
	 * 		book0.invoke(invokers0.or_else(() => set_book(null)))
	 *
	 * 		return () => {
	 * 			book0.cancel("Component refreshed")
	 * 		}
	 * 	}, [id])
	 *
	 * 	if (!book) return null
	 *
	 * 	return (
	 * 		<div>
	 * 			<h1>{book.title}</h1>
	 * 			<p>{book.description}</p>
	 * 		</div>
	 * 	)
	 * }
	 * ```
	 */
	public cancel(
		/**
		 * Reason the Oath is cancelled with.
		 *
		 * @optional
		 * @default "Cancelled"
		 */
		reason = "Cancelled",
	): void {
		this._abort_controller.abort(reason)
	}

	/**
	 * Apply a custom operator to the current Oath. An operator is a function that accepts
	 * the current Oath and returns a new Oath with any changes made to the current state
	 * of the Oath (or no changes at all).
	 *
	 * There are a few importable operators available as separate functions or as `ops0`
	 * object inside the `@ordo-pink/oath` package.
	 *
	 * @see {@link ops0 Operators}
	 * @example
	 * import { Oath, ops0, invokers0 } from "@ordo-pink/oath"
	 *
	 * const excellent_example0 = Oath.Resolve(1)
	 * 	.pipe(ops0.map(x => x + 1))
	 * 	.pipe(ops0.tap(console.log))
	 * 	.pipe(ops0.map(x => x + 2))
	 *
	 * // Console output: <no output>
	 *
	 * excellent_example0
	 * 	.invoke(invokers0.or_nothing)
	 * 	.then(console.log)
	 *
	 * // Console output:
	 * // 2
	 * // 4
	 */
	public pipe<NewResolve, NewReject>(
		/**
		 * An operator function that will be added to the pipeline of Oath execution.
		 *
		 * @see {@link ops0 Operators}
		 */
		operator: (o: Oath<$TResolve, $TReject>) => Oath<NewResolve, NewReject>,
	): Oath<NewResolve, NewReject> {
		if (this.is_cancelled) return this as unknown as Oath<NewResolve, NewReject>
		return operator(this)
	}

	/**
	 * Transform Oath value similarly to `Promise.then`. Does not accept second function for rejected
	 * case. Has a different name to avoid collisions with awaiting `Thenable`. Can be provided with
	 * a resolver with any return type.
	 *
	 * - If the resolver returns an `Oath`, it works like `ops0.chain`
	 * - If the resolver returns a `Promise`, it creates Oath from Promise and works like `ops0.chain`
	 * - If the resolver returns any other value, it works like `ops0.map`
	 *
	 * @see {@link ops0 Operators}
	 *
	 * @example
	 * ```typescript
	 * Oath.Resolve(1)
	 * 	.and(x => x + 1)
	 * 	.and(x => Promise.resolve(x + 1))
	 * 	.and(x => Oath.Resolve(x + 1))
	 * 	.and(console.log)
	 * 	.invoke(invokers0.or_nothing) // 4
	 * ```
	 */
	public and<NewResolve, NewReject>(
		/**
		 * Handler for the value Oath resolved with.
		 */
		on_resolve: (
			x: $TResolve,
		) => PromiseLike<NewResolve> | Oath<NewResolve, NewReject> | NewResolve,
	): Oath<NewResolve, NewReject extends unknown ? $TReject : $TReject | NewReject> {
		return new Oath(
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			(resolve, reject) =>
				this.fork(
					a => (this.is_cancelled ? reject(this.cancellation_reason as any) : reject(a as any)),
					b => {
						if (this.is_cancelled) {
							return reject(this.cancellation_reason as any)
						}

						try {
							const forked: any = on_resolve(b)

							if (!forked) return resolve(forked)
							if (forked.is_oath) return forked.fork(reject, resolve)
							if (forked.then)
								return Oath.FromPromise(() => forked).fork(reject as any, resolve as any)
							return resolve(forked)
						} catch (e) {
							reject(e instanceof Error ? e : (new Error(String(e)) as any))
						}
					},
				),
			this._abort_controller,
		)
	}

	/**
	 * An equivalent of `Promise.catch`. Can be provided with a handler with any return type. Returns
	 * an Oath that will resolve.

	 * @example
	 * ```typescript
	 * Oath.Reject(1)
	 * 	.fix(x => x + 1)
	 * 	.and(x => Promise.resolve(x + 1))
	 * 	.and(x => Oath.Resolve(x + 1))
	 * 	.and(console.log)
	 * 	.invoke(invokers0.or_nothing) // 4
	 * ```
	 */
	public fix<_TNewResolve, _TNewReject = never>(
		/**
		 * Handler for the value Oath rejected with.
		 */
		on_reject: (
			x: $TReject,
		) => PromiseLike<_TNewResolve> | Oath<_TNewResolve, _TNewReject> | _TNewResolve,
	): Oath<$TResolve | _TNewResolve, _TNewReject> {
		return new Oath(
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			(resolve, reject) =>
				this.fork(
					a => {
						if (this.is_cancelled) return reject(this.cancellation_reason as any)

						try {
							const forked: any = on_reject(a)

							if (!forked) return resolve(forked)
							if (forked.is_oath) return forked.fork(reject, resolve)
							if (forked.then) return Oath.FromPromise(() => forked)
							return resolve(forked)
						} catch (e) {
							reject(e instanceof Error ? e : (new Error(String(e)) as any))
						}
					},
					b => resolve(b),
				),
			this._abort_controller,
		)
	}

	/**
	 * Invokes an Oath with a given function. The function should accept the current Oath and
	 * return a Promise. Using invoke itself does not trigger the Oath to start execution, it's
	 * the {@link Oath.fork} that does the job. `Oath.invoke` is just a convenience method for
	 * calling fork in different ways.
	 *
	 * @see {@link invokers0}
	 *
	 * @example
	 * ```typescript
	 * Oath.Resolve(1)
	 * 	.invoke(oath => oath.fork(() => null, x => x)) // Simple custom invoker
	 * 	.then(console.log) // 1
	 * ```
	 */
	public invoke<NewResolve>(
		invoker: (o: Oath<$TResolve, $TReject>) => Promise<NewResolve>,
	): Promise<NewResolve> {
		return invoker(this)
	}

	/**
	 * Switch the Oath from lazy to eager mode. The Oath does not start execution before this
	 * method is called. Accepts a rejection and resolution handler functions. Has a facade
	 * {@link Oath.invoke} for simpler usage.
	 *
	 * @example
	 * ```typescript
	 * Oath.Resolve(1)
	 * 	.fork(() => "rejected", () => "resolved")
	 * 	.then(console.log) // "resolved"
	 * ```
	 */
	public fork<_TNewResolve, _TNewReject>(
		on_reject: (error: $TReject) => _TNewReject,
		on_resolve: (value: $TResolve) => _TNewResolve,
	): Promise<_TNewResolve | _TNewReject> {
		return new Promise<_TNewResolve>((resolve, reject) => {
			this.is_cancelled
				? reject(this.cancellation_reason)
				: this.cata(resolve as any, reject as any)
		}).then((x: any) => on_resolve(x), on_reject) as any
	}
}

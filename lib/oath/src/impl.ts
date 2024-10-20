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

// TODO: Replace never in $TReject with unknown
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
		value: $TResolve,
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
		value?: $TReject,
		abort_controller: AbortController = new AbortController(),
	): Oath<$TResolve, $TReject> => new Oath((_, reject) => reject(value), abort_controller)

	public static If = <$TResolve = undefined, $TReject = undefined>(
		predicate: boolean,
		explosion?: TOathIfExplosion<$TResolve, $TReject>,
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
		abort_controller: AbortController = new AbortController(),
	): Oath<void, $TReject> => new Oath(resolve => resolve(undefined), abort_controller)

	/**
	 * Create an Oath of given value. If the value is `null` or `undefined`, the Oath rejects with
	 * a `null`. The Oath resolves with provided value otherwise. You can customise what the Oath
	 * rejects with by providing a `on_null` function as a second argument.
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
		on_null: () => $TReject = () => null as unknown as $TReject,
		abort_controller: AbortController = new AbortController(),
	): Oath<NonNullable<$TResolve>, $TReject> =>
		value == null ? Oath.Reject(on_null(), abort_controller) : Oath.Resolve(value, abort_controller)

	/**
	 * Lazily create an Oath from given Promise. The Promise is not initialised if Oath is not
	 * invoked or forked. If the Promise rejects, the Oath rejects with the same value. If the
	 * Promise resolves, the Oath resolves with the same value. Since Promises do not provide
	 * rejected branch type definitions, it is up to the programmer to specify the Oath rejection
	 * type.
	 *
	 * @example
	 * ```typescript
	 * Oath.FromPromise<Error | AggregateError>(() => promises.readFile("./package.json"))
	 *
	 * Oath.FromPromise(() => new Promise(resolve => resolve("Hello, world!")))
	 * ```
	 */
	public static FromPromise = <$TResolve, $TReject = Error>(
		thunk: () => Promise<$TResolve>,
		abort_controller: AbortController = new AbortController(),
	): Oath<$TResolve, $TReject> =>
		new Oath((resolve, reject) => thunk().then(resolve, reject), abort_controller)

	public static Try = <$TResolve, $TReject = Error>(
		thunk: () => $TResolve,
		on_error = (error: unknown) =>
			error instanceof Error ? error : (new Error(String(error as any)) as any),
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

	public static Merge = <$TSomeThings extends readonly unknown[] | [] | Record<string, unknown>>(
		values: $TSomeThings,
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

	_abort_controller: AbortController

	// TODO: Define cata return type
	cata: (
		Resolved: <_TNewResolve>(value: $TResolve) => _TNewResolve,
		Rejected: <_TNewReject>(err?: $TReject) => _TNewReject,
	) => any

	public constructor(
		// TODO: Define cata return type
		cata: (
			resolve: <_TNewResolve>(value: $TResolve) => _TNewResolve,
			reject: <_TNewReject>(err?: $TReject) => _TNewReject,
		) => any,
		abortController: AbortController = new AbortController(),
	) {
		this.cata = cata
		this._abort_controller = abortController
	}

	public get is_oath(): boolean {
		return true
	}

	public get is_cancelled(): boolean {
		return this._abort_controller.signal.aborted
	}

	public get cancellation_reason(): string | undefined {
		return this.is_cancelled ? this._abort_controller.signal.reason : undefined
	}

	public cancel(reason = "Cancelled") {
		this._abort_controller.abort(reason)
	}

	public pipe<NewResolve, NewReject>(
		operator: (o: Oath<$TResolve, $TReject>) => Oath<NewResolve, NewReject>,
	): Oath<NewResolve, NewReject> {
		return operator(this)
	}

	public and<NewResolve, NewReject>(
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

	public fix<_TNewResolve, _TNewReject = never>(
		on_reject: (
			x: $TReject,
		) => PromiseLike<_TNewResolve> | Oath<_TNewResolve, _TNewReject> | _TNewResolve,
	): Oath<$TResolve | _TNewResolve, _TNewReject> {
		return new Oath(
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			(resolve, reject) =>
				this.fork(
					a => {
						if (this.is_cancelled) {
							return reject(this.cancellation_reason as any)
						}

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

	// TODO: Use .cata
	public invoke<NewResolve>(
		invoker: (o: Oath<$TResolve, $TReject>) => Promise<NewResolve>,
	): Promise<NewResolve> {
		return invoker(this)
	}

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

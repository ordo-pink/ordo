// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { type UnderOath } from "./types"

import {
	empty_oath,
	from_nullable_oath,
	from_promise_oath,
	if_oath,
	merge_oath,
	reject_oath,
	resolve_oath,
	try_oath,
} from "../constructors/index"
import { invokers } from "../invokers/index"
import { ops } from "../operators/index"

// TODO: Replace never in $TReject with unknown
export class Oath<$TResolve, $TReject = never> {
	public static Resolve = resolve_oath

	public static Reject = reject_oath

	public static If = if_oath

	public static Empty = empty_oath

	public static FromNullable = from_nullable_oath

	public static FromPromise = from_promise_oath

	public static Try = try_oath

	public static Merge = merge_oath

	public static invokers = invokers

	public static ops = ops

	_abort_controller: AbortController

	// TODO: Define cata return type
	cata: (
		Resolve: <_TNewResolve>(value: $TResolve) => _TNewResolve,
		Reject: <_TNewReject>(err?: $TReject) => _TNewReject,
	) => any

	public constructor(
		// TODO: Define cata return type
		cata: (
			resolve: <_TNewResolve>(value: $TResolve) => _TNewResolve,
			reject: <_TNewReject>(err?: $TReject) => _TNewReject,
		) => any,
		abortController = new AbortController(),
	) {
		this.cata = cata
		this._abort_controller = abortController
	}

	public get is_oath() {
		return true
	}

	public get is_cancelled() {
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
								return from_promise_oath(() => forked).fork(reject as any, resolve as any)
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
							if (forked.then) return from_promise_oath(() => forked)
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
	public invoke<NewResolve>(invoker: (o: Oath<$TResolve, $TReject>) => Promise<NewResolve>) {
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

	// TODO: Drop deprecated methods
	// TODO: Add ops
	// TODO: Add invokers
	// TODO: Add constructors

	/**
	 * @deprecated The number of Oath methods and static methods will be reduced in v1.0.0. Make sure
	 * you migrate to using operators via `oath.pipe`, invokers via `oath.invoke` and constructors like
	 * `try0`, `merge0` (same as current `Oath.all`), `fromPromise0` (same as current `Oath.from`),
	 * `fromNullable0`, etc.
	 * @see readme.md
	 */
	public static of<Resolve, Reject = never>(
		value: Resolve,
		abortController = new AbortController(),
	): Oath<Resolve, Reject> {
		return new Oath(resolve => resolve(value), abortController)
	}

	/**
	 * @deprecated The number of Oath methods and static methods will be reduced in v1.0.0. Make sure
	 * you migrate to using operators via `oath.pipe`, invokers via `oath.invoke` and constructors like
	 * `try0`, `merge0` (same as current `Oath.all`), `fromPromise0` (same as current `Oath.from`),
	 * `fromNullable0`, etc.
	 * @see readme.md
	 */
	public static empty<Reject = never>(abortController = new AbortController()): Oath<void, Reject> {
		return new Oath(resolve => resolve(undefined), abortController)
	}

	/**
	 * @deprecated The number of Oath methods and static methods will be reduced in v1.0.0. Make sure
	 * you migrate to using operators via `oath.pipe`, invokers via `oath.invoke` and constructors like
	 * `try0`, `merge0` (same as current `Oath.all`), `fromPromise0` (same as current `Oath.from`),
	 * `fromNullable0`, etc.
	 * @see readme.md
	 */
	public static from<Resolve, Reject = never>(
		thunk: () => Promise<Resolve>,
		abortController = new AbortController(),
	): Oath<Resolve, Reject> {
		return new Oath((resolve, reject) => thunk().then(resolve, reject), abortController)
	}

	/**
	 * @deprecated The number of Oath methods and static methods will be reduced in v1.0.0. Make sure
	 * you migrate to using operators via `oath.pipe`, invokers via `oath.invoke` and constructors like
	 * `try0`, `merge0` (same as current `Oath.all`), `fromPromise0` (same as current `Oath.from`),
	 * `fromNullable0`, etc.
	 * @see readme.md
	 */
	public static fromNullable<Resolve>(
		value?: Resolve | null,
		abortController = new AbortController(),
	): Oath<NonNullable<Resolve>, null> {
		return value == null ? Oath.Reject(null, abortController) : Oath.Resolve(value, abortController)
	}

	/**
	 * @deprecated The number of Oath methods and static methods will be reduced in v1.0.0. Make sure
	 * you migrate to using operators via `oath.pipe`, invokers via `oath.invoke` and constructors like
	 * `try0`, `merge0` (same as current `Oath.all`), `fromPromise0` (same as current `Oath.from`),
	 * `fromNullable0`, etc.
	 * @see readme.md
	 */
	public static fromBoolean<Resolve, Reject = null>(
		f: () => boolean,
		onTrue: () => Resolve,
		onFalse: () => Reject = () => null as any,
		abortController = new AbortController(),
	): Oath<Resolve, Reject> {
		return f() ? Oath.Resolve(onTrue(), abortController) : Oath.Reject(onFalse(), abortController)
	}

	/**
	 * @deprecated The number of Oath methods and static methods will be reduced in v1.0.0. Make sure
	 * you migrate to using operators via `oath.pipe`, invokers via `oath.invoke` and constructors like
	 * `try0`, `merge0` (same as current `Oath.all`), `fromPromise0` (same as current `Oath.from`),
	 * `fromNullable0`, etc.
	 * @see readme.md
	 */
	public static ifElse<Resolve, OnTrue = Resolve, OnFalse = Resolve>(
		validate: (x: Resolve) => boolean,
		{
			onTrue = x => x as any,
			onFalse = x => x as any,
		}: {
			onTrue?: (x: Resolve) => OnTrue
			onFalse?: (x: Resolve) => OnFalse
		},
		abortController = new AbortController(),
	) {
		return (x: Resolve) =>
			validate(x)
				? Oath.Resolve(onTrue(x), abortController)
				: Oath.Reject(onFalse(x), abortController)
	}

	/**
	 * @deprecated The number of Oath methods and static methods will be reduced in v1.0.0. Make sure
	 * you migrate to using operators via `oath.pipe`, invokers via `oath.invoke` and constructors like
	 * `try0`, `merge0` (same as current `Oath.all`), `fromPromise0` (same as current `Oath.from`),
	 * `fromNullable0`, etc.
	 * @see readme.md
	 */
	public static try<Resolve, Reject = Error>(
		f: () => Resolve,
		abortController = new AbortController(),
	): Oath<Awaited<Resolve>, Reject> {
		return new Oath(async (resolve, reject) => {
			try {
				// eslint-disable-next-line @typescript-eslint/await-thenable
				resolve(await f())
			} catch (e) {
				reject(e instanceof Error ? e : (new Error(String(e)) as any))
			}
		}, abortController)
	}

	/**
	 * @deprecated The number of Oath methods and static methods will be reduced in v1.0.0. Make sure
	 * you migrate to using operators via `oath.pipe`, invokers via `oath.invoke` and constructors like
	 * `try0`, `merge0` (same as current `Oath.all`), `fromPromise0` (same as current `Oath.from`),
	 * `fromNullable0`, etc.
	 * @see readme.md
	 */
	public static all<TSomeThings extends readonly unknown[] | [] | Record<string, unknown>>(
		values: TSomeThings,
		abortController = new AbortController(),
	): Oath<
		TSomeThings extends []
			? { -readonly [P in keyof TSomeThings]: UnderOath<TSomeThings[P]> }
			: { [P in keyof TSomeThings]: UnderOath<TSomeThings[P]> }
	> {
		let rejected = false

		if (Array.isArray(values)) {
			const resolvedValues = [] as any[]
			let resolvedLength = 0

			return new Oath((outerResolve: any, outerReject: any) => {
				if (!values.length) return outerResolve([])

				values.forEach(value => {
					if (value.is_oath) {
						value.fork(
							(e: any) => {
								if (!rejected) {
									rejected = true
									outerReject(e)
								}
							},
							(s: any) => {
								if (rejected) return

								resolvedValues.push(s)
								resolvedLength++

								if (resolvedLength === values.length) outerResolve(resolvedValues)
							},
						)
					} else if (value.then) {
						value.then(
							(s: any) => {
								if (rejected) return
								resolvedValues.push(s)
								resolvedLength++

								if (resolvedLength === values.length) outerResolve(resolvedValues)
							},
							(e: any) => {
								if (!rejected) {
									rejected = true
									outerReject(e)
								}
							},
						)
					} else {
						resolvedValues.push(value)
						resolvedLength++
					}
				})
			}, abortController)
		} else {
			const resolvedValues = {} as any
			let resolvedLength = 0

			return new Oath((outerResolve: any, outerReject: any) => {
				const keys = Object.keys(values)
				if (!keys.length) return outerResolve({})

				keys.forEach(key => {
					const value = (values as any)[key]

					if (value && value.is_oath) {
						value.fork(
							(e: any) => {
								if (!rejected) {
									rejected = true
									outerReject(e)
								}
							},
							(s: any) => {
								if (rejected) return

								resolvedValues[key] = s
								resolvedLength++

								if (resolvedLength === keys.length) outerResolve(resolvedValues)
							},
						)
					} else if (value && value.then) {
						value.then(
							(s: any) => {
								if (rejected) return

								resolvedValues[key] = s
								resolvedLength++

								if (resolvedLength === keys.length) outerResolve(resolvedValues)
							},
							(e: any) => {
								if (!rejected) {
									rejected = true
									outerReject(e)
								}
							},
						)
					} else {
						resolvedValues[key] = value
						resolvedLength++
						if (resolvedLength === keys.length) outerResolve(resolvedValues)
					}
				})
			}, abortController)
		}
	}

	/**
	 * @deprecated The number of Oath methods and static methods will be reduced in v1.0.0. Make sure
	 * you migrate to using operators via `oath.pipe`, invokers via `oath.invoke` and constructors like
	 * `try0`, `merge0` (same as current `Oath.all`), `fromPromise0` (same as current `Oath.from`),
	 * `fromNullable0`, etc.
	 * @see readme.md
	 */
	public swap(): Oath<$TReject, $TResolve> {
		return new Oath<$TReject, $TResolve>(
			(resolve, reject) =>
				this.fork(
					a => (this.is_cancelled ? reject(this.cancellation_reason as any) : resolve(a)),
					b => reject(b),
				),
			this._abort_controller,
		)
	}

	/**
	 * @deprecated The number of Oath methods and static methods will be reduced in v1.0.0. Make sure
	 * you migrate to using operators via `oath.pipe`, invokers via `oath.invoke` and constructors like
	 * `try0`, `merge0` (same as current `Oath.all`), `fromPromise0` (same as current `Oath.from`),
	 * `fromNullable0`, etc.
	 * @see readme.md
	 */
	public tap(
		onResolved: (x: $TResolve) => any,
		onRejected: (x: $TReject) => any = () => void 0,
	): Oath<$TResolve, $TReject> {
		return new Oath<$TResolve, $TReject>(
			(resolve, reject) =>
				this.fork(
					a => {
						if (this.is_cancelled) {
							return reject(this.cancellation_reason as any)
						}

						onRejected(a)
						return reject(a)
					},
					b => {
						if (this.is_cancelled) {
							return reject(this.cancellation_reason as any)
						}

						onResolved(b)
						return resolve(b)
					},
				),
			this._abort_controller,
		)
	}

	/**
	 * @deprecated The number of Oath methods and static methods will be reduced in v1.0.0. Make sure
	 * you migrate to using operators via `oath.pipe`, invokers via `oath.invoke` and constructors like
	 * `try0`, `merge0` (same as current `Oath.all`), `fromPromise0` (same as current `Oath.from`),
	 * `fromNullable0`, etc.
	 * @see readme.md
	 */
	public bitap(
		onRejected: (x: $TReject) => any,
		onResolved: (x: $TResolve) => any,
	): Oath<$TResolve, $TReject> {
		return new Oath<$TResolve, $TReject>(
			(resolve, reject) =>
				this.fork(
					a => {
						onRejected(a)
						return reject(a)
					},
					b => {
						if (this.is_cancelled) {
							return reject(this.cancellation_reason as any)
						}

						onResolved(b)
						return resolve(b)
					},
				),
			this._abort_controller,
		)
	}

	/**
	 * @deprecated The number of Oath methods and static methods will be reduced in v1.0.0. Make sure
	 * you migrate to using operators via `oath.pipe`, invokers via `oath.invoke` and constructors like
	 * `try0`, `merge0` (same as current `Oath.all`), `fromPromise0` (same as current `Oath.from`),
	 * `fromNullable0`, etc.
	 * @see readme.md
	 */
	public map<NewResolve>(f: (x: $TResolve) => NewResolve): Oath<NewResolve, $TReject> {
		return new Oath<NewResolve, $TReject>(
			(resolve, reject) =>
				this.fork(
					a => (this.is_cancelled ? reject(this.cancellation_reason as any) : reject(a)),
					b => (this.is_cancelled ? reject(this.cancellation_reason as any) : resolve(f(b))),
				),
			this._abort_controller,
		)
	}

	/**
	 * @deprecated The number of Oath methods and static methods will be reduced in v1.0.0. Make sure
	 * you migrate to using operators via `oath.pipe`, invokers via `oath.invoke` and constructors like
	 * `try0`, `merge0` (same as current `Oath.all`), `fromPromise0` (same as current `Oath.from`),
	 * `fromNullable0`, etc.
	 * @see readme.md
	 */
	public rejectedMap<NewReject>(f: (x: $TReject) => NewReject): Oath<$TResolve, NewReject> {
		return new Oath<$TResolve, NewReject>(
			(resolve, reject) =>
				this.fork(
					a => (this.is_cancelled ? reject(this.cancellation_reason as any) : reject(f(a))),
					b => (this.is_cancelled ? reject(this.cancellation_reason as any) : resolve(b)),
				),
			this._abort_controller,
		)
	}

	/**
	 * @deprecated The number of Oath methods and static methods will be reduced in v1.0.0. Make sure
	 * you migrate to using operators via `oath.pipe`, invokers via `oath.invoke` and constructors like
	 * `try0`, `merge0` (same as current `Oath.all`), `fromPromise0` (same as current `Oath.from`),
	 * `fromNullable0`, etc.
	 * @see readme.md
	 */
	public bimap<NewResolve, NewReject>(
		f: (x: $TReject) => NewReject,
		g: (x: $TResolve) => NewResolve,
	): Oath<NewResolve, NewReject> {
		return new Oath<NewResolve, NewReject>(
			(resolve, reject) =>
				this.fork(
					a => (this.is_cancelled ? reject(this.cancellation_reason as any) : reject(f(a))),
					b => (this.is_cancelled ? reject(this.cancellation_reason as any) : resolve(g(b))),
				),
			this._abort_controller,
		)
	}

	/**
	 * @deprecated The number of Oath methods and static methods will be reduced in v1.0.0. Make sure
	 * you migrate to using operators via `oath.pipe`, invokers via `oath.invoke` and constructors like
	 * `try0`, `merge0` (same as current `Oath.all`), `fromPromise0` (same as current `Oath.from`),
	 * `fromNullable0`, etc.
	 * @see readme.md
	 */
	public chain<NewResolve, NewReject>(
		f: (x: $TResolve) => Oath<NewResolve, NewReject>,
	): Oath<NewResolve, $TReject | NewReject> {
		return new Oath(
			(resolve, reject) =>
				this.fork(
					a => (this.is_cancelled ? reject(this.cancellation_reason as any) : reject(a)),
					b =>
						this.is_cancelled
							? reject(this.cancellation_reason as any)
							: f(b).fork(reject, resolve),
				),
			this._abort_controller,
		)
	}

	/**
	 * @deprecated The number of Oath methods and static methods will be reduced in v1.0.0. Make sure
	 * you migrate to using operators via `oath.pipe`, invokers via `oath.invoke` and constructors like
	 * `try0`, `merge0` (same as current `Oath.all`), `fromPromise0` (same as current `Oath.from`),
	 * `fromNullable0`, etc.
	 * @see readme.md
	 */
	public rejectedChain<NewReject>(
		f: (x: $TReject) => Oath<$TResolve, NewReject>,
	): Oath<$TResolve, NewReject> {
		return new Oath(
			(resolve, reject) =>
				this.fork(
					a =>
						this.is_cancelled
							? reject(this.cancellation_reason as any)
							: f(a).fork(reject, resolve),
					b => (this.is_cancelled ? this : resolve(b)),
				),
			this._abort_controller,
		)
	}

	/**
	 * @deprecated The number of Oath methods and static methods will be reduced in v1.0.0. Make sure
	 * you migrate to using operators via `oath.pipe`, invokers via `oath.invoke` and constructors like
	 * `try0`, `merge0` (same as current `Oath.all`), `fromPromise0` (same as current `Oath.from`),
	 * `fromNullable0`, etc.
	 * @see readme.md
	 */
	public async toPromise() {
		return new Promise<$TResolve>((resolve, reject) => {
			this.is_cancelled
				? reject(this.cancellation_reason)
				: this.cata(resolve as any, reject as any)
		})
	}

	/**
	 * @deprecated The number of Oath methods and static methods will be reduced in v1.0.0. Make sure
	 * you migrate to using operators via `oath.pipe`, invokers via `oath.invoke` and constructors like
	 * `try0`, `merge0` (same as current `Oath.all`), `fromPromise0` (same as current `Oath.from`),
	 * `fromNullable0`, etc.
	 * @see readme.md
	 */
	public async orElse<NewReject>(onRejected: (error: $TReject) => NewReject) {
		return new Promise<$TResolve>((resolve, reject) =>
			this.is_cancelled
				? reject(this.cancellation_reason)
				: this.cata(resolve as any, reject as any),
		).catch(onRejected)
	}

	/**
	 * @deprecated The number of Oath methods and static methods will be reduced in v1.0.0. Make sure
	 * you migrate to using operators via `oath.pipe`, invokers via `oath.invoke` and constructors like
	 * `try0`, `merge0` (same as current `Oath.all`), `fromPromise0` (same as current `Oath.from`),
	 * `fromNullable0`, etc.
	 * @see readme.md
	 */
	public async orNothing() {
		return new Promise<$TResolve>((resolve, reject) => {
			this.is_cancelled
				? reject(this.cancellation_reason)
				: this.cata(resolve as any, reject as any)
		}).catch(() => void 0)
	}
}

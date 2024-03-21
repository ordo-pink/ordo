// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { type UnderOath } from "./types"
import { fromPromise0 } from "../constructors/from-promise"

export class Oath<Resolve, Reject = never> {
	public static resolve<Resolve, Reject = never>(
		value: Resolve,
		abortController = new AbortController(),
	): Oath<Resolve, Reject> {
		return new Oath(resolve => resolve(value), abortController)
	}

	public static reject<Reject, Resolve = never>(
		err?: Reject,
		abortController = new AbortController(),
	): Oath<Resolve, Reject> {
		return new Oath((_, reject) => reject(err), abortController)
	}

	_abortController: AbortController

	_resolver: (
		resolve: <NewResolve>(value: Resolve) => NewResolve,
		reject: <NewReject>(err?: Reject) => NewReject,
	) => any

	public constructor(
		resolver: (
			resolve: <NewResolve>(value: Resolve) => NewResolve,
			reject: <NewReject>(err?: Reject) => NewReject,
		) => any,
		abortController = new AbortController(),
	) {
		this._resolver = resolver
		this._abortController = abortController
	}

	public get isOath() {
		return true
	}

	public get isCancelled() {
		return this._abortController.signal.aborted
	}

	public get cancellationReason(): string | null {
		return this.isCancelled ? this._abortController.signal.reason : null
	}

	public cancel(reason = "Cancelled") {
		this._abortController.abort(reason)
	}

	public pipe<NewResolve, NewReject>(
		operator: (o: Oath<Resolve, Reject>) => Oath<NewResolve, NewReject>,
	): Oath<NewResolve, NewReject> {
		return operator(this)
	}

	public and<NewResolve, NewReject>(
		onResolved: (x: Resolve) => PromiseLike<NewResolve> | Oath<NewResolve, NewReject> | NewResolve,
	): Oath<NewResolve, NewReject extends unknown ? Reject : Reject | NewReject> {
		return new Oath(
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			(resolve, reject) =>
				this.fork(
					a => (this.isCancelled ? reject(this.cancellationReason as any) : reject(a as any)),
					b => {
						if (this.isCancelled) {
							return reject(this.cancellationReason as any)
						}

						try {
							const forked: any = onResolved(b)

							if (!forked) return resolve(forked)
							if (forked.isOath) return forked.fork(reject, resolve)
							if (forked.then) return fromPromise0(() => forked).fork(reject as any, resolve as any)
							return resolve(forked)
						} catch (e) {
							reject(e instanceof Error ? e : (new Error(String(e)) as any))
						}
					},
				),
			this._abortController,
		)
	}

	public fix<NewResolve, NewReject = never>(
		onRejected: (x: Reject) => PromiseLike<NewResolve> | Oath<NewResolve, NewReject> | NewResolve,
	): Oath<Resolve | NewResolve, NewReject> {
		return new Oath(
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			(resolve, reject) =>
				this.fork(
					a => {
						if (this.isCancelled) {
							return reject(this.cancellationReason as any)
						}

						try {
							const forked: any = onRejected(a)

							if (!forked) return resolve(forked)
							if (forked.isOath) return forked.fork(reject, resolve)
							if (forked.then) return fromPromise0(() => forked)
							return resolve(forked)
						} catch (e) {
							reject(e instanceof Error ? e : (new Error(String(e)) as any))
						}
					},
					b => resolve(b),
				),
			this._abortController,
		)
	}

	public invoke<NewResolve>(invoker: (o: Oath<Resolve, Reject>) => Promise<NewResolve>) {
		return invoker(this)
	}

	public fork<NewResolve, NewReject>(
		onRejected: (error: Reject) => NewReject,
		onResolved: (value: Resolve) => NewResolve,
	): Promise<NewResolve | NewReject> {
		return new Promise<NewResolve>((resolve, reject) => {
			this.isCancelled
				? reject(this.cancellationReason)
				: this._resolver(resolve as any, reject as any)
		}).then((x: any) => onResolved(x), onRejected) as any
	}

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
		return value == null ? Oath.reject(null, abortController) : Oath.resolve(value, abortController)
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
		return f() ? Oath.resolve(onTrue(), abortController) : Oath.reject(onFalse(), abortController)
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
				? Oath.resolve(onTrue(x), abortController)
				: Oath.reject(onFalse(x), abortController)
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
					if (value.isOath) {
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

					if (value && value.isOath) {
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
	public swap(): Oath<Reject, Resolve> {
		return new Oath<Reject, Resolve>(
			(resolve, reject) =>
				this.fork(
					a => (this.isCancelled ? reject(this.cancellationReason as any) : resolve(a)),
					b => reject(b),
				),
			this._abortController,
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
		onResolved: (x: Resolve) => any,
		onRejected: (x: Reject) => any = () => void 0,
	): Oath<Resolve, Reject> {
		return new Oath<Resolve, Reject>(
			(resolve, reject) =>
				this.fork(
					a => {
						if (this.isCancelled) {
							return reject(this.cancellationReason as any)
						}

						onRejected(a)
						return reject(a)
					},
					b => {
						if (this.isCancelled) {
							return reject(this.cancellationReason as any)
						}

						onResolved(b)
						return resolve(b)
					},
				),
			this._abortController,
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
		onRejected: (x: Reject) => any,
		onResolved: (x: Resolve) => any,
	): Oath<Resolve, Reject> {
		return new Oath<Resolve, Reject>(
			(resolve, reject) =>
				this.fork(
					a => {
						onRejected(a)
						return reject(a)
					},
					b => {
						if (this.isCancelled) {
							return reject(this.cancellationReason as any)
						}

						onResolved(b)
						return resolve(b)
					},
				),
			this._abortController,
		)
	}

	/**
	 * @deprecated The number of Oath methods and static methods will be reduced in v1.0.0. Make sure
	 * you migrate to using operators via `oath.pipe`, invokers via `oath.invoke` and constructors like
	 * `try0`, `merge0` (same as current `Oath.all`), `fromPromise0` (same as current `Oath.from`),
	 * `fromNullable0`, etc.
	 * @see readme.md
	 */
	public map<NewResolve>(f: (x: Resolve) => NewResolve): Oath<NewResolve, Reject> {
		return new Oath<NewResolve, Reject>(
			(resolve, reject) =>
				this.fork(
					a => (this.isCancelled ? reject(this.cancellationReason as any) : reject(a)),
					b => (this.isCancelled ? reject(this.cancellationReason as any) : resolve(f(b))),
				),
			this._abortController,
		)
	}

	/**
	 * @deprecated The number of Oath methods and static methods will be reduced in v1.0.0. Make sure
	 * you migrate to using operators via `oath.pipe`, invokers via `oath.invoke` and constructors like
	 * `try0`, `merge0` (same as current `Oath.all`), `fromPromise0` (same as current `Oath.from`),
	 * `fromNullable0`, etc.
	 * @see readme.md
	 */
	public rejectedMap<NewReject>(f: (x: Reject) => NewReject): Oath<Resolve, NewReject> {
		return new Oath<Resolve, NewReject>(
			(resolve, reject) =>
				this.fork(
					a => (this.isCancelled ? reject(this.cancellationReason as any) : reject(f(a))),
					b => (this.isCancelled ? reject(this.cancellationReason as any) : resolve(b)),
				),
			this._abortController,
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
		f: (x: Reject) => NewReject,
		g: (x: Resolve) => NewResolve,
	): Oath<NewResolve, NewReject> {
		return new Oath<NewResolve, NewReject>(
			(resolve, reject) =>
				this.fork(
					a => (this.isCancelled ? reject(this.cancellationReason as any) : reject(f(a))),
					b => (this.isCancelled ? reject(this.cancellationReason as any) : resolve(g(b))),
				),
			this._abortController,
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
		f: (x: Resolve) => Oath<NewResolve, NewReject>,
	): Oath<NewResolve, Reject | NewReject> {
		return new Oath(
			(resolve, reject) =>
				this.fork(
					a => (this.isCancelled ? reject(this.cancellationReason as any) : reject(a)),
					b =>
						this.isCancelled ? reject(this.cancellationReason as any) : f(b).fork(reject, resolve),
				),
			this._abortController,
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
		f: (x: Reject) => Oath<Resolve, NewReject>,
	): Oath<Resolve, NewReject> {
		return new Oath(
			(resolve, reject) =>
				this.fork(
					a =>
						this.isCancelled ? reject(this.cancellationReason as any) : f(a).fork(reject, resolve),
					b => (this.isCancelled ? this : resolve(b)),
				),
			this._abortController,
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
		return new Promise<Resolve>((resolve, reject) => {
			this.isCancelled
				? reject(this.cancellationReason)
				: this._resolver(resolve as any, reject as any)
		})
	}

	/**
	 * @deprecated The number of Oath methods and static methods will be reduced in v1.0.0. Make sure
	 * you migrate to using operators via `oath.pipe`, invokers via `oath.invoke` and constructors like
	 * `try0`, `merge0` (same as current `Oath.all`), `fromPromise0` (same as current `Oath.from`),
	 * `fromNullable0`, etc.
	 * @see readme.md
	 */
	public async orElse<NewReject>(onRejected: (error: Reject) => NewReject) {
		return new Promise<Resolve>((resolve, reject) =>
			this.isCancelled
				? reject(this.cancellationReason)
				: this._resolver(resolve as any, reject as any),
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
		return new Promise<Resolve>((resolve, reject) => {
			const handleAbort = () => {
				this._abortController.signal.removeEventListener("abort", handleAbort)
				reject(this.cancellationReason)
			}

			this._abortController.signal.addEventListener("abort", handleAbort)

			this.isCancelled
				? reject(this.cancellationReason)
				: this._resolver(resolve as any, reject as any)
		}).catch(() => void 0)
	}
}

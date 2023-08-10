// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

// deno-lint-ignore-file no-explicit-any

import { Nullable, keysOf, noop } from "#lib/tau/mod.ts"

type UnderOath<T> = T extends object & {
	and(onfulfilled: infer F, ...args: infer _): any
}
	? F extends (value: infer V, ...args: infer _) => any
		? UnderOath<V>
		: never
	: Awaited<T>

export class Oath<TRight, TLeft = never> {
	public static of<TRight, TLeft = never>(value: TRight): Oath<TRight, TLeft> {
		return new Oath(resolve => {
			resolve(value)
		})
	}

	public static empty(): Oath<void, never> {
		return new Oath(resolve => {
			resolve()
		})
	}

	public static resolve<TRight, TLeft = never>(value: TRight): Oath<TRight, TLeft> {
		return new Oath(resolve => {
			resolve(value)
		})
	}

	public static reject<TLeft, TRight = never>(error?: TLeft): Oath<TRight, TLeft> {
		return new Oath((_, reject) => {
			reject(error)
		})
	}

	public static from<TRight, TLeft = never>(thunk: () => Promise<TRight>): Oath<TRight, TLeft> {
		return new Oath((resolve, reject) => {
			thunk().then(resolve, reject)
		})
	}

	public static fromNullable<T>(value?: Nullable<T>): Oath<NonNullable<T>, null> {
		return value == null ? Oath.reject(null) : Oath.resolve(value)
	}

	public static fromBoolean<T, F = null>(
		f: () => boolean,
		onTrue: () => T,
		onFalse: () => F = () => null as any
	): Oath<T, F> {
		return f() ? Oath.resolve(onTrue()) : Oath.reject(onFalse())
	}

	public static try<TRight, TLeft = Error>(f: () => TRight): Oath<Awaited<TRight>, TLeft> {
		return new Oath(async (resolve, reject) => {
			try {
				resolve(await f())
			} catch (e) {
				reject(e)
			}
		})
	}

	public static all<TSomeThings extends readonly unknown[] | [] | Record<string, unknown>>(
		values: TSomeThings
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
							}
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
							}
						)
					} else {
						resolvedValues.push(value)
						resolvedLength++
					}
				})
			})
		} else {
			const resolvedValues = {} as any
			let resolvedLength = 0

			return new Oath((outerResolve: any, outerReject: any) => {
				const keys = keysOf(values)
				if (!keys.length) return outerResolve({})

				keys.forEach(key => {
					const value = values[key] as any

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

								resolvedValues[key] = s
								resolvedLength++

								if (resolvedLength === keys.length) outerResolve(resolvedValues)
							}
						)
					} else if (value.then) {
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
							}
						)
					} else {
						resolvedValues[key] = value
						resolvedLength++
						if (resolvedLength === keys.length) outerResolve(resolvedValues)
					}
				})
			})
		}
	}

	public constructor(
		private resolver: (
			resolve: <TNewRight>(value: TRight) => TNewRight,
			reject: <TNewLeft>(err?: TLeft) => TNewLeft
		) => void
	) {}

	public get isOath() {
		return true
	}

	public swap(): Oath<TLeft, TRight> {
		return new Oath<TLeft, TRight>((resolve, reject) =>
			this.fork(
				a => resolve(a),
				b => reject(b)
			)
		)
	}

	public tap(f: (x: TRight) => any, g: (x: TLeft) => any = noop): Oath<TRight, TLeft> {
		return new Oath<TRight, TLeft>((resolve, reject) =>
			this.fork(
				a => {
					g(a)
					return reject(a)
				},
				b => {
					f(b)
					return resolve(b)
				}
			)
		)
	}

	public map<ThenRight>(f: (x: TRight) => ThenRight): Oath<ThenRight, TLeft> {
		return new Oath<ThenRight, TLeft>((resolve, reject) =>
			this.fork(
				a => reject(a),
				b => resolve(f(b))
			)
		)
	}

	public rejectedMap<ThenLeft>(f: (x: TLeft) => ThenLeft): Oath<TRight, ThenLeft> {
		return new Oath<TRight, ThenLeft>((resolve, reject) =>
			this.fork(
				a => reject(f(a)),
				b => resolve(b)
			)
		)
	}

	public bimap<ThenRight, ThenLeft>(
		f: (x: TLeft) => ThenLeft,
		g: (x: TRight) => ThenRight
	): Oath<ThenRight, ThenLeft> {
		return new Oath<ThenRight, ThenLeft>((resolve, reject) =>
			this.fork(
				a => reject(f(a)),
				b => resolve(g(b))
			)
		)
	}

	public chain<ThenRight, ThenLeft>(
		f: (x: TRight) => Oath<ThenRight, ThenLeft>
	): Oath<ThenRight, TLeft | ThenLeft> {
		return new Oath((resolve, reject) =>
			this.fork(
				a => reject(a),
				b => f(b).fork(reject, resolve)
			)
		)
	}

	public rejectedChain<ThenRight, ThenLeft>(
		f: (x: TLeft) => Oath<TRight, ThenLeft>
	): Oath<TRight, ThenLeft> {
		return new Oath((resolve, reject) =>
			this.fork(
				a => f(a).fork(reject, resolve),
				b => resolve(b)
			)
		)
	}

	// TODO: Add support for the second function (catch)
	public and<ThenRight, ThenLeft>(
		f: (x: TRight) => PromiseLike<ThenRight> | Oath<ThenRight, ThenLeft> | ThenRight
	): Oath<ThenRight, TLeft | ThenLeft> {
		return new Oath((resolve, reject) =>
			this.fork(
				a => reject(a),
				b => {
					try {
						const forked: any = f(b)

						if (!forked) return resolve(forked)
						if (forked.isOath) return forked.fork(reject, resolve)
						if (forked.then) return Oath.from(() => forked).fork(reject as any, resolve as any)
						return resolve(forked)
					} catch (e) {
						reject(e)
					}
				}
			)
		)
	}

	public fix<ThenRight, ThenLeft = never>(
		f: (x: TLeft) => PromiseLike<ThenRight> | Oath<ThenRight, ThenLeft> | ThenRight
	): Oath<TRight | ThenRight, ThenLeft> {
		return new Oath((resolve, reject) =>
			this.fork(
				a => {
					try {
						const forked: any = f(a)

						if (!forked) return resolve(forked)
						if (forked.isOath) return forked.fork(reject, resolve)
						if (forked.then) return Oath.from(() => forked)
						return resolve(forked)
					} catch (e) {
						reject(e)
					}
				},
				b => resolve(b)
			)
		)
	}

	public fork<TNewRight, TNewLeft>(
		onLeft: (error: TLeft) => TNewLeft,
		onRight: (value: TRight) => TNewRight
	): Promise<TNewRight> {
		// TODO: Store reject (https://medium.com/@masnun/creating-cancellable-promises-33bf4b9da39c)

		return new Promise<TNewRight>((resolve, reject) => {
			this.resolver(resolve as any, reject as any)
		}).then((x: any) => onRight(x), onLeft) as any
	}

	public toPromise() {
		return new Promise<TRight>((resolve, reject) => {
			this.resolver(resolve as any, reject as any)
		})
	}

	public orElse<TNewLeft>(f: (error: TLeft) => TNewLeft) {
		return new Promise<TRight>((resolve, reject) =>
			this.resolver(resolve as any, reject as any)
		).catch(f)
	}

	public orNothing() {
		return new Promise<TRight>((resolve, reject) =>
			this.resolver(resolve as any, reject as any)
		).catch(() => void 0)
	}
}

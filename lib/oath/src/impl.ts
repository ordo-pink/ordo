// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

export const oathify =
	<Args extends any[], Result extends Promise<any>>(f: (...args: Args) => Result) =>
	(...args: Args) =>
		Oath.try(() => f(...args))

export type UnderOath<T> = T extends object & {
	and(onfulfilled: infer F, ...args: infer _): any
}
	? F extends (value: infer V, ...args: infer _) => any
		? UnderOath<V>
		: never
	: Awaited<T>

export class Oath<Resolve, Reject = never> {
	public static of<Resolve, Reject = never>(value: Resolve): Oath<Resolve, Reject> {
		return new Oath(resolve => resolve(value))
	}

	public static empty<Reject = never>(): Oath<void, Reject> {
		return new Oath(resolve => resolve(undefined))
	}

	public static resolve<Resolve, Reject = never>(value: Resolve): Oath<Resolve, Reject> {
		return new Oath(resolve => resolve(value))
	}

	public static reject<Reject, Resolve = never>(error?: Reject): Oath<Resolve, Reject> {
		return new Oath((_, reject) => reject(error))
	}

	public static from<Resolve, Reject = never>(
		thunk: () => Promise<Resolve>,
	): Oath<Resolve, Reject> {
		return new Oath((resolve, reject) => thunk().then(resolve, reject))
	}

	public static fromNullable<Resolve>(value?: Resolve | null): Oath<NonNullable<Resolve>, null> {
		return value == null ? Oath.reject(null) : Oath.resolve(value)
	}

	public static fromBoolean<Resolve, Reject = null>(
		f: () => boolean,
		onTrue: () => Resolve,
		onFalse: () => Reject = () => null as any,
	): Oath<Resolve, Reject> {
		return f() ? Oath.resolve(onTrue()) : Oath.reject(onFalse())
	}

	public static ifElse<Resolve, OnTrue = Resolve, OnFalse = Resolve>(
		validate: (x: Resolve) => boolean,
		{
			onTrue = x => x as any,
			onFalse = x => x as any,
		}: {
			onTrue?: (x: Resolve) => OnTrue
			onFalse?: (x: Resolve) => OnFalse
		},
	) {
		return (x: Resolve) => (validate(x) ? Oath.resolve(onTrue(x)) : Oath.reject(onFalse(x)))
	}

	public static try<Resolve, Reject = Error>(f: () => Resolve): Oath<Awaited<Resolve>, Reject> {
		return new Oath(async (resolve, reject) => {
			try {
				resolve(await f())
			} catch (e) {
				reject(e instanceof Error ? e : (new Error(String(e)) as any))
			}
		})
	}

	public static all<TSomeThings extends readonly unknown[] | [] | Record<string, unknown>>(
		values: TSomeThings,
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
			})
		} else {
			const resolvedValues = {} as any
			let resolvedLength = 0

			return new Oath((outerResolve: any, outerReject: any) => {
				const keys = Object.keys(values)
				if (!keys.length) return outerResolve({})

				keys.forEach(key => {
					const value = (values as any)[key] as any

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
			})
		}
	}

	public constructor(
		private resolver: (
			resolve: <NewResolve>(value: Resolve) => NewResolve,
			reject: <NewReject>(err?: Reject) => NewReject,
		) => void,
	) {}

	public get isOath() {
		return true
	}

	public swap(): Oath<Reject, Resolve> {
		return new Oath<Reject, Resolve>((resolve, reject) =>
			this.fork(
				a => resolve(a),
				b => reject(b),
			),
		)
	}

	public tap(
		onResolved: (x: Resolve) => any,
		onRejected: (x: Reject) => any = () => void 0,
	): Oath<Resolve, Reject> {
		return new Oath<Resolve, Reject>((resolve, reject) =>
			this.fork(
				a => {
					onRejected(a)
					return reject(a)
				},
				b => {
					onResolved(b)
					return resolve(b)
				},
			),
		)
	}

	public bitap(
		onRejected: (x: Reject) => any,
		onResolved: (x: Resolve) => any,
	): Oath<Resolve, Reject> {
		return new Oath<Resolve, Reject>((resolve, reject) =>
			this.fork(
				a => {
					onRejected(a)
					return reject(a)
				},
				b => {
					onResolved(b)
					return resolve(b)
				},
			),
		)
	}

	public map<NewResolve>(f: (x: Resolve) => NewResolve): Oath<NewResolve, Reject> {
		return new Oath<NewResolve, Reject>((resolve, reject) =>
			this.fork(
				a => reject(a),
				b => resolve(f(b)),
			),
		)
	}

	public rejectedMap<NewReject>(f: (x: Reject) => NewReject): Oath<Resolve, NewReject> {
		return new Oath<Resolve, NewReject>((resolve, reject) =>
			this.fork(
				a => reject(f(a)),
				b => resolve(b),
			),
		)
	}

	public bimap<NewResolve, NewReject>(
		f: (x: Reject) => NewReject,
		g: (x: Resolve) => NewResolve,
	): Oath<NewResolve, NewReject> {
		return new Oath<NewResolve, NewReject>((resolve, reject) =>
			this.fork(
				a => reject(f(a)),
				b => resolve(g(b)),
			),
		)
	}

	public chain<NewResolve, NewReject>(
		f: (x: Resolve) => Oath<NewResolve, NewReject>,
	): Oath<NewResolve, Reject | NewReject> {
		return new Oath((resolve, reject) =>
			this.fork(
				a => reject(a),
				b => f(b).fork(reject, resolve),
			),
		)
	}

	public rejectedChain<NewReject>(
		f: (x: Reject) => Oath<Resolve, NewReject>,
	): Oath<Resolve, NewReject> {
		return new Oath((resolve, reject) =>
			this.fork(
				a => f(a).fork(reject, resolve),
				b => resolve(b),
			),
		)
	}

	public and<NewResolve, NewReject>(
		f: (x: Resolve) => PromiseLike<NewResolve> | Oath<NewResolve, NewReject> | NewResolve,
	): Oath<NewResolve, Reject | NewReject> {
		return new Oath((resolve, reject) =>
			this.fork(
				a => reject(a),
				b => {
					try {
						const forked: any = f(b)

						if (!forked) return resolve(forked)
						if (forked.isOath) return forked.fork(reject, resolve) as any
						if (forked.then) return Oath.from(() => forked).fork(reject as any, resolve as any)
						return resolve(forked)
					} catch (e) {
						reject(e instanceof Error ? e : (new Error(String(e)) as any))
					}
				},
			),
		)
	}

	public fix<NewResolve, NewReject = never>(
		f: (x: Reject) => PromiseLike<NewResolve> | Oath<NewResolve, NewReject> | NewResolve,
	): Oath<Resolve | NewResolve, NewReject> {
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
						reject(e instanceof Error ? e : (new Error(String(e)) as any))
					}
				},
				b => resolve(b),
			),
		)
	}

	public async fork<NewResolve, NewReject>(
		onRejected: (error: Reject) => NewReject,
		onResolved: (value: Resolve) => NewResolve,
	): Promise<NewResolve | NewReject> {
		return new Promise<NewResolve>((resolve, reject) => {
			this.resolver(resolve as any, reject as any)
		}).then((x: any) => onResolved(x), onRejected) as any
	}

	public async toPromise() {
		return new Promise<Resolve>((resolve, reject) => {
			this.resolver(resolve as any, reject as any)
		})
	}

	public async orElse<NewReject>(onRejected: (error: Reject) => NewReject) {
		return new Promise<Resolve>((resolve, reject) =>
			this.resolver(resolve as any, reject as any),
		).catch(onRejected)
	}

	public async orNothing() {
		return new Promise<Resolve>((resolve, reject) =>
			this.resolver(resolve as any, reject as any),
		).catch(() => void 0)
	}
}

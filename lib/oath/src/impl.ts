// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

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

	public run<NewResolve>(runner: (o: Oath<Resolve, Reject>) => Promise<NewResolve>) {
		return runner(this)
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
}

// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

// deno-lint-ignore-file no-explicit-any

import {
	bichain_oath,
	bimap_oath,
	bitap_oath,
	chain_oath,
	map_oath,
	rejected_chain_oath,
	rejected_map_oath,
	rejected_tap_oath,
	swap_oath,
	tap_oath,
} from "./operators/index.ts"
import {
	empty_oath,
	from_nullable_oath,
	from_promise_oath,
	if_oath,
	merge_oath,
	reject_oath,
	resolve_oath,
	try_oath,
} from "./constructors/index.ts"
import { or_else_oath, or_nothing_oath, to_promise_oath } from "./invokers/index.ts"

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

	public static invokers = {
		or_else: or_else_oath,
		or_nothing: or_nothing_oath,
		to_promise: to_promise_oath,
	}

	public static ops = {
		bichain: bichain_oath,
		bimap: bimap_oath,
		bitap: bitap_oath,
		chain: chain_oath,
		map: map_oath,
		rejected_chain: rejected_chain_oath,
		rejected_map: rejected_map_oath,
		rejected_tap: rejected_tap_oath,
		swap: swap_oath,
		tap: tap_oath,
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

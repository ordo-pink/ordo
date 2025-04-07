import { type Oath } from "../../oath.types"
// import { from_promise } from "./from-promise.impl"

export const create: Oath.Constructors.Create = (fork, cancellation_reason) => {
	let reason: Oath.CancellationReason | undefined = cancellation_reason

	return {
		get is_cancelled() {
			return typeof reason === "string"
		},
		get is_oath() {
			return true as const
		},
		get reason() {
			return reason
		},

		cancel: r => void (reason = r),
		cata: explosion => fork(explosion.resolve as any, explosion.reject as any),
		pipe: f => (reason ? (create(fork, reason) as any) : f(create(fork, reason) as any)),
	}
}

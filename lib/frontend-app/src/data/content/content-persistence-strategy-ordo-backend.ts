import { Oath, ops0 } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/core"
import { TZags } from "@ordo-pink/zags"

export const PersistenceStrategyContentOrdoBackend = {
	Of: (
		dt_host: string,
		fetch: Ordo.Fetch,
		$: TZags<{ user: Ordo.User.Current.Instance | null; token: string | null }>,
	): Ordo.Content.PersistenceStrategy => {
		return {
			clear: () => Oath.Reject(RRR.codes.eio("NOT IMPLEMENTED")),
			delete: () => Oath.Reject(RRR.codes.eio("NOT IMPLEMENTED")),
			exists: () => Oath.Reject(RRR.codes.eio("NOT IMPLEMENTED")),
			get: (uid, fsid) =>
				Oath.FromNullable($.select("token"), () => new Error("User is not authenticated"))
					.and(token => fetch(`${dt_host}/${uid}/${fsid}`, { headers: { Authorization: `Bearer ${token}` } }))
					.and(res => Oath.If(res.status === 200, { T: () => res }))
					.and(res => res.body)
					.pipe(ops0.rejected_map((e: Error) => RRR.codes.eio(e?.message, e))),
			list: () => Oath.Reject(RRR.codes.eio("NOT IMPLEMENTED")),
			put: (uid, fsid, body) =>
				Oath.FromNullable($.select("token"), () => new Error("User is not authenticated"))
					.and(token =>
						fetch(`${dt_host}/${uid}/${fsid}`, { headers: { Authorization: `Bearer ${token}` }, method: "PUT", body }),
					)
					.and(res => res.json())
					.and(res => Oath.If(res.success))
					.pipe(ops0.rejected_map((e: Error) => RRR.codes.eio(e?.message, e))),
		}
	},
}

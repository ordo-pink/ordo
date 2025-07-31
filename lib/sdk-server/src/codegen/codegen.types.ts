import type { Core } from "@ordo-pink/sdk-core"
import type { Oath } from "@ordo-pink/oath"

export type Instance = {
	generate: () => Oath.Instance<string>
	hash: (code: string) => Oath.Instance<string, Core.Rrr.Instance<"EIO">>
	verify: (code: string, hash: string) => Oath.Instance<boolean, Core.Rrr.Instance<"EIO">>
}

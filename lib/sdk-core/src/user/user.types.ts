import type { Subscribed, subscribed } from "./mixins/subscribed.mixin"
import type { Authenticated } from "./mixins/authenticated.mixin"
import type { Creatable } from "../mixins/creatable.mixin"
import type { Identifiable } from "../mixins/identifiable.mixin"
import type { Named } from "../mixins/named.mixin"
import type { Receptive } from "./mixins/receptive.mixin"
import type { Referable } from "./mixins/referable.mixin"
import type { SpaceLimited } from "./mixins/space-limited.mixin"
import type { Timestampable } from "../mixins/timestampable.mixin"
import type { Transferable } from "../mixins/transferable.mixin"
import type { UIExtendable } from "./mixins/ui-extendable.mixin"

export namespace User {
	export type UserID = Identifiable.ID

	export namespace Public {
		export type DTO = [
			...Identifiable.DTO,
			...Timestampable.DTO<"without_updates">,
			...Referable.DTO,
			...Subscribed.DTO,
			...Named.DTO,
		]

		// Extracted to prevent circular reference
		export type DataInterface = Identifiable.Interface &
			Timestampable.Interface<"without_updates"> &
			Referable.Interface &
			Subscribed.Interface &
			Named.Interface

		export type Interface = DataInterface & Transferable.Interface<DTO, DataInterface>
	}

	export namespace Current {
		export type CreateParams = [
			email: Receptive.Email,
			handle?: Referable.Handle,
			subscription?: subscribed.SUBSCRIPTION,
			name?: Named.Name,
			fns?: UIExtendable.Fn[],
			fn_limit?: UIExtendable.FnLimit,
			file_limit?: SpaceLimited.FileLimit,
			file_size_limit?: SpaceLimited.FileSizeLimit,
		]

		export type DTO = [...Public.DTO, ...Receptive.DTO, ...UIExtendable.DTO, ...SpaceLimited.DTO, ...Authenticated.DTO]

		// Extracted to prevent circular reference
		export type DataInterface = Public.DataInterface &
			Receptive.Interface &
			UIExtendable.Interface &
			SpaceLimited.Interface &
			Authenticated.Interface

		export type Interface = DataInterface &
			Transferable.Interface<DTO, DataInterface> &
			Creatable.Interface<CreateParams, DataInterface>
	}
}

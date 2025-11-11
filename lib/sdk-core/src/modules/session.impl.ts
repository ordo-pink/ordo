/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { impl as fns } from "./fns.impl"
import { impl as timestamp } from "./timestamp.impl"
import { impl as uuid } from "./uuid.impl"
import { impl as validations } from "./validations.impl"

export namespace impl {
	export const guard: Ordo.Session.Guard = (x): x is Ordo.Session.Instance =>
		validations.is_array(x) && timestamp.guard(x[0]) && validations.is_non_empty_string(x[1]) && fns.lt(255, x[1].length)

	export const get_issued_at: Ordo.Session.GetIssuedAt = fns.prop(0)
	export const get_name: Ordo.Session.GetName = fns.prop(1)

	export namespace server {
		export const guard: Ordo.Session.Server.Guard = (x): x is Ordo.Session.Server.Instance =>
			impl.guard(x) && uuid.guard((x as any)[2])

		export const get_id: Ordo.Session.Server.GetId = fns.prop(2)

		export const has_id: Ordo.Session.Server.HasId = fns.curry((id, s) => get_id(s) === id)
	}
}

declare global {
	namespace Ordo.Session {
		/** Time at which the session was issued. */
		type IssuedAt = Timestamp.Instance

		/** Readable name of the session to be displayed to the user. */
		type Name = string

		type Instance = [issued_at: IssuedAt, name: Name]

		type GetIssuedAt = (session: Instance | Ordo.Session.Server.Instance) => IssuedAt
		type GetName = (session: Instance | Ordo.Session.Server.Instance) => Name

		type Guard = GenericGuard<Instance>
	}

	namespace Ordo.Session.Server {
		type LifetimeMinutes = number & {}
		type LifetimeMinutesGuard = (x: any) => x is LifetimeMinutes

		type Id = Ordo.Uuid.Instance
		type Instance = [...Ordo.Session.Instance, sid: Ordo.Uuid.Instance]

		type Guard = (x: any) => x is Instance

		type Repository = {
			create: (uid: Ordo.User.Id, info: string) => Oath.Instance<Id, Ordo.Rrr.Instance<"EIO" | "EEXIST">>
			read: (uid: Ordo.User.Id) => Oath.Instance<Instance[], Ordo.Rrr.Instance<"EIO" | "ENOENT">>
			update: (uid: Ordo.User.Id, sid: Id) => Oath.Instance<Instance, Ordo.Rrr.Instance<"EIO" | "ENOENT">>
			delete: (uid: Ordo.User.Id, sid: Id) => Oath.Instance<void, Ordo.Rrr.Instance<"EIO" | "ENOENT">>
			kill: () => void
		}

		type GetId = (session: Instance) => Id

		type HasId = Ordo.Fns.Curried<(id: Id, session: Instance) => boolean>
	}
}

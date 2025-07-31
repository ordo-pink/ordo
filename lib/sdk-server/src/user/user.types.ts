import type { Core } from "@ordo-pink/sdk-core"
import type { Oath } from "@ordo-pink/oath"

export type Session = [id: Core.Uuid.Instance, ...Core.Session.Instance]
export type Sessions = Session[]

type Replace<$Arr extends any[], $Type, $NewType> = $Arr extends [infer _This, ...infer _Rest]
	? _This extends $Type
		? [$NewType, ..._Rest]
		: [_This, ...Replace<_Rest, $Type, $NewType>]
	: never

export type Instance = Replace<Core.User.Instance, Core.User.Sessions, Sessions>

export type Repository = {
	create: (user: Instance) => Oath.Instance<Instance, Core.Rrr.Instance<"EIO" | "EEXIST">>
	read: (id: Core.User.Id) => Oath.Instance<Instance, Core.Rrr.Instance<"EIO" | "ENOENT">>
	update: (id: Core.User.Id, dto: Instance) => Oath.Instance<Instance, Core.Rrr.Instance<"EIO" | "ENOENT">>
	delete: (id: Core.User.Id) => Oath.Instance<void, Core.Rrr.Instance<"EIO" | "ENOENT">>

	get_by_email: (email: Core.User.Email) => Oath.Instance<Instance, Core.Rrr.Instance<"EIO" | "ENOENT">>
	get_by_ref: (ref: Core.User.Ref) => Oath.Instance<Instance, Core.Rrr.Instance<"EIO" | "ENOENT">>
}

export type GetSession = (user: Instance) => Sessions
export type HasSession = (session: Session, user: Instance) => boolean
export type Serialize = (user: Instance) => Core.User.Instance
export type SerializeSession = (session: Session) => Core.Session.Instance

export type ObfuscateEmail = (email: Core.User.Email) => Core.User.Email

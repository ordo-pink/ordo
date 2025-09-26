import * as fns from "./fns.impl"
import * as sem_ver from "./sem-ver.impl"
import * as validations from "./validations.impl"

/** Only used for highlighting paying users so that they feel it was worth paying (it was not). */
export enum SUBSCRIPTION {
	FREE,
	PERSONAL,
	FAMILY,
	TEAM,
	ENTERPRISE,
	length,
}

export const ref_rx = /^[a-z0-9_]{1,23}$/

export const email_rx =
	// eslint-disable-next-line no-useless-escape
	/^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/

export const function_name_rx = /^@[a-z0-9_.-]+\/[a-z0-9_.-]+$/

export const create_ref: Ordo.User.CreateRef = (id, email) => email.split("@")[0].concat(id.split("-")[0])

export const default_name: Ordo.User.DefaultName = () => ""
export const default_subscription: Ordo.User.DefaultSubscription = () => SUBSCRIPTION.FREE

export const ref_guard: Ordo.User.RefGuard = (x): x is Ordo.User.Ref => validations.is_string(x) && ref_rx.test(x)
export const name_guard: Ordo.User.NameGuard = (x): x is Ordo.User.Name => validations.is_string(x) && fns.lt(256, x.length)
export const subscription_guard: Ordo.User.SubscriptionGuard = (x): x is Ordo.User.Subscription =>
	validations.is_non_negative_integer(x) && fns.lt(SUBSCRIPTION.length, x)
export const email_guard: Ordo.User.EmailGuard = (x): x is Ordo.User.Email => validations.is_string(x) && email_rx.test(x)
export const installed_function_guard: Ordo.User.InstalledFunctionGuard = (x): x is Ordo.User.InstalledFunction =>
	result
		.if_else(validations.is_string(x), { on_true: () => x as string })
		.pipe(result.ops.map(x => x.split(":")))
		.pipe(result.ops.chain(parts => result.if_else(parts.length === 2, { on_true: () => parts })))
		.pipe(result.ops.map(([name, version]) => function_name_rx.test(name) && sem_ver.guard(version)))
		.cata(result.catas.or_else(() => false))

export const get_id: Ordo.User.GetId = fns.prop(0)
export const get_ref: Ordo.User.GetRef = fns.prop(1)
export const get_name: Ordo.User.GetName = fns.prop(2)
export const get_subscription: Ordo.User.GetSubscription = fns.prop(3)
export const get_created_at: Ordo.User.GetCreatedAt = fns.prop(4)
export const get_updated_at: Ordo.User.GetUpdatedAt = fns.prop(5)
export const get_email: Ordo.User.GetEmail = fns.prop(6)
export const get_installed_functions: Ordo.User.GetInstalledFunctions = fns.prop(7)
export const get_sessions: Ordo.User.GetSessions = fns.prop(8)

export const has_the_name: Ordo.User.HasTheName = (x, dto) => fns.eq(get_name(dto), x)
export const has_the_id: Ordo.User.HasTheId = (x, dto) => fns.eq(get_id(dto), x)
export const has_the_ref: Ordo.User.HasTheRef = (x, dto) => fns.eq(get_ref(dto), x)
export const has_the_subscription: Ordo.User.HasTheSubscription = (x, dto) => fns.pipe(get_subscription).pipe(fns.eq(x))(dto)
export const has_the_email: Ordo.User.HasTheEmail = (email, dto) => fns.eq(get_email(dto), email)

export const is_paid: Ordo.User.IsPaid = fns.pipe(get_subscription).pipe(fns.gt(SUBSCRIPTION.FREE))
export const is_free: Ordo.User.IsFree = fns.pipe(get_subscription).pipe(fns.eq(SUBSCRIPTION.FREE))
export const has_name: Ordo.User.HasName = fns.pipe(get_name).pipe(validations.is_non_empty_string)

export const has_sessions: Ordo.User.HasSessions = fns.pipe(get_sessions).pipe(fns.prop("length")).pipe(fns.gt(0))

export const has_installed_function: Ordo.User.HasInstalledFunction = (f, dto) => get_installed_functions(dto).includes(f)
export const has_installed_functions: Ordo.User.HasInstalledFunctions = fns
	.pipe(get_installed_functions)
	.pipe(fns.prop("length"))
	.pipe(fns.gt(0))

declare global {
	namespace Ordo.User {
		export type Id = Uuid.Instance & {}
		export type Ref = string & {}
		export type Name = string & {}
		export type IsDev = 0 | 1
		export type Subscription = SUBSCRIPTION
		export type CreatedAt = Timestamp.Instance & {}
		export type UpdatedAt = Timestamp.Instance & {}
		export type Email = `${string}@${string}.${string}` & {}
		export type InstalledFunctionName = `@${string}/${string}` & {}
		export type InstalledFunction = `${InstalledFunctionName}:${SemVer.Instance}` & {}
		export type InstalledFunctions = InstalledFunction[]
		export type Parent = Id | null
		export type Sessions = Session.Instance[]
		export type CarbonCopy = Id & {}
		export type CarbonCopies = CarbonCopy[]

		export type OtherUserInstance = [id: Id, ref: Ref, name: Name, subscription: Subscription]
		export type Instance = [
			...OtherUserInstance,
			created_at: CreatedAt,
			updated_at: UpdatedAt,
			email: Email,
			installed_functions: InstalledFunctions,
			sessions: Sessions,
			parent: Parent,
			cc: CarbonCopies,
		]

		export type CreateRef = (id: Id, email: Email) => Ref

		export type Serialize = (user: Instance) => Instance
		export type SerializeOtherUser = (user: OtherUserInstance) => OtherUserInstance

		export type DefaultName = () => Name
		export type DefaultSubscription = () => Subscription
		export type DefaultParent = () => Parent
		export type DefaultInstalledFunctions = () => InstalledFunctions

		export type RefGuard = GenericGuard<Ref>
		export type NameGuard = GenericGuard<Name>
		export type SubscriptionGuard = GenericGuard<Subscription>
		export type EmailGuard = GenericGuard<Email>
		export type InstalledFunctionGuard = GenericGuard<InstalledFunction>

		export type GetRef = (user: OtherUserInstance | Instance) => Ref
		export type GetName = (user: OtherUserInstance | Instance) => Name
		export type GetId = (user: OtherUserInstance | Instance) => Id
		export type GetSubscription = (user: OtherUserInstance | Instance) => Subscription
		export type GetCreatedAt = (user: Instance) => CreatedAt
		export type GetUpdatedAt = (user: Instance) => UpdatedAt
		export type GetEmail = (user: Instance) => Email
		export type GetInstalledFunctions = (user: Instance) => InstalledFunctions
		export type GetSessions = (user: Instance) => Sessions

		export type HasTheName = (name: Name, user: OtherUserInstance | Instance) => boolean
		export type HasTheId = (id: Id, user: OtherUserInstance | Instance) => boolean
		export type HasTheRef = (ref: Ref, user: OtherUserInstance | Instance) => boolean
		export type HasTheSubscription = (subscription: Subscription, user: OtherUserInstance | Instance) => boolean
		export type HasTheEmail = (email: Email, user: Instance) => boolean

		export type IsPaid = (user: OtherUserInstance | Instance) => boolean
		export type IsFree = (user: OtherUserInstance | Instance) => boolean
		export type HasName = (user: OtherUserInstance | Instance) => boolean
		export type HasSessions = (user: Instance) => boolean
		export type HasInstalledFunction = (f: InstalledFunction, user: Instance) => boolean
		export type HasInstalledFunctions = (user: Instance) => boolean
		export type CanDo = (action: Permission.Action, user: Instance, data: Data.Instance) => boolean
	}
}

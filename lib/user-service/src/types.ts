import { T as TAU } from "#lib/tau/mod.ts"
import { Oath } from "#lib/oath/mod.ts"

export type PublicUser = {
	email: string
	username?: string
	createdAt: Date
	firstName?: string
	lastName?: string
}

export type User = PublicUser & {
	id: string
	emailConfirmed: boolean
}

export type InternalUser = User & {
	password: string
}

export type Adapter = {
	existsById: (id: string) => Oath<boolean, Error>
	existsByEmail: (email: string) => Oath<boolean, Error>
	create(user: InternalUser): Oath<InternalUser, Error>
	getById(id: string): Oath<InternalUser, TAU.Nullable<Error>>
	getByEmail(email: string): Oath<InternalUser, TAU.Nullable<Error>>
	update(id: string, user: Partial<InternalUser>): Oath<InternalUser, TAU.Nullable<Error>>
	// remove: (id: string) => Promise<Nullable<InternalUser>>
}

export type CreateMethod<P> = TAU.Method<P, Adapter, "create">
export type GetByEmailMethod<P> = TAU.Method<P, Adapter, "getByEmail">
export type GetByIdMethod<P> = TAU.Method<P, Adapter, "getById">
export type ExistsByEmailMethod<P> = TAU.Method<P, Adapter, "existsByEmail">
export type ExistsByIdMethod<P> = TAU.Method<P, Adapter, "existsById">
export type UpdateMethod<P> = TAU.Method<P, Adapter, "update">

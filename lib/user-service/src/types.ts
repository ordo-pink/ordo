import { Method, Nullable } from "#lib/tau/mod.ts"
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

export type UserRepository = {
	existsById: (id: string) => Oath<boolean, Error>
	existsByEmail: (email: string) => Oath<boolean, Error>
	create(user: InternalUser): Oath<InternalUser, Error>
	getById(id: string): Oath<InternalUser, Nullable<Error>>
	getByEmail(email: string): Oath<InternalUser, Nullable<Error>>
	update(id: string, user: Partial<InternalUser>): Oath<InternalUser, Nullable<Error>>
	// remove: (id: string) => Promise<Nullable<InternalUser>>
}

export type CreateMethod<P> = Method<P, UserRepository, "create">
export type GetByEmailMethod<P> = Method<P, UserRepository, "getByEmail">
export type GetByIdMethod<P> = Method<P, UserRepository, "getById">
export type ExistsByEmailMethod<P> = Method<P, UserRepository, "existsByEmail">
export type ExistsByIdMethod<P> = Method<P, UserRepository, "existsById">
export type UpdateMethod<P> = Method<P, UserRepository, "update">

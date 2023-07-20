import { Nullable } from "#lib/tau/mod.ts"
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

export type UserAdapter = {
	// existsById: (id: string) => Promise<boolean>
	// existsByEmail: (email: string) => Promise<boolean>
	create(user: InternalUser): Oath<InternalUser, "User already exists">
	getById(id: string): Oath<InternalUser, null>
	getByEmail(email: string): Oath<InternalUser, null>
	update(id: string, user: Partial<InternalUser>): Oath<InternalUser, null>
	// remove: (id: string) => Promise<Nullable<InternalUser>>
}

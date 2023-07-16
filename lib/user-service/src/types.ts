import { Nullable } from "#lib/tau/mod.ts"

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

export type UserDriver = {
	// existsById: (id: string) => Promise<boolean>
	// existsByEmail: (email: string) => Promise<boolean>
	create: (user: InternalUser) => Promise<InternalUser>
	getById: (id: string) => Promise<Nullable<InternalUser>>
	getByEmail: (email: string) => Promise<Nullable<InternalUser>>
	update: (
		id: string,
		user: Partial<InternalUser>
	) => Promise<Nullable<InternalUser>>
	// remove: (id: string) => Promise<Nullable<InternalUser>>
}

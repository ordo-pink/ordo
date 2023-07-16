import { InternalUser, PublicUser, UserDriver } from "#lib/user-service/mod.ts"
import { Nullable } from "#lib/tau/mod.ts"

export class DenoKVUserDriver implements UserDriver {
	#db: Deno.Kv

	public static async of(path: string) {
		const db = await Deno.openKv(path)
		return new DenoKVUserDriver(db)
	}

	protected constructor(db: Deno.Kv) {
		this.#db = db
	}

	public async create(user: InternalUser): Promise<InternalUser> {
		const pk = ["users", user.id]
		const sk = ["users_by_email", user.email]

		const res = await this.#db
			.atomic()
			.check({ key: pk, versionstamp: null })
			.check({ key: sk, versionstamp: null })
			.set(pk, user)
			.set(sk, user)
			.commit()

		if (!res.ok) throw new Error("User with given email already exists")

		return user
	}

	public async getByEmail(email: string): Promise<Nullable<InternalUser>> {
		const maybeUser: Deno.KvEntryMaybe<InternalUser> = await this.#db.get([
			"users_by_email",
			email,
		])

		return maybeUser.value ?? null
	}

	public async getById(id: string): Promise<Nullable<InternalUser>> {
		const maybeUser: Deno.KvEntryMaybe<InternalUser> = await this.#db.get([
			"users",
			id,
		])

		return maybeUser.value ?? null
	}

	public async update(
		id: string,
		user: Partial<PublicUser>
	): Promise<Nullable<InternalUser>> {
		const maybeUser: Deno.KvEntryMaybe<InternalUser> = await this.#db.get([
			"users",
			id,
		])

		if (!maybeUser.value) return null

		const updatedUser = {
			...maybeUser.value,
			...user,
		}

		const pk = ["users", id]

		if (user.email) {
			const osk = ["users_by_email", maybeUser.value.email]
			const sk = ["users_by_email", user.email]

			const res = await this.#db
				.atomic() // TODO: Add versionstamp checks
				.delete(osk)
				.set(pk, updatedUser)
				.set(sk, updatedUser)
				.commit()

			return res.ok ? updatedUser : null
		}

		const sk = ["users_by_email", maybeUser.value.email]

		const res = await this.#db
			.atomic() // TODO: Add versionstamp checks
			.set(pk, updatedUser)
			.set(sk, updatedUser)
			.commit()

		return res.ok ? updatedUser : null
	}
}

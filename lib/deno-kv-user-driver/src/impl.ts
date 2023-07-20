import { InternalUser, PublicUser, UserAdapter } from "#lib/user-service/mod.ts"
import { Nullable } from "#lib/tau/mod.ts"

export class DenoKVUserAdapter implements UserAdapter {
	#db: Deno.Kv
	#tableName: string

	public static async of(path: string, tableName: string) {
		const db = await Deno.openKv(path)
		return new DenoKVUserAdapter(db, tableName)
	}

	protected constructor(db: Deno.Kv, tableName: string) {
		this.#db = db
		this.#tableName = tableName
	}

	public async create(user: InternalUser): Promise<InternalUser> {
		const pk = [this.#tableName, user.id]
		const sk = [`${this.#tableName}_by_email`, user.email]

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
			`${this.#tableName}_by_email`,
			email,
		])

		return maybeUser.value ?? null
	}

	public async getById(id: string): Promise<Nullable<InternalUser>> {
		const maybeUser: Deno.KvEntryMaybe<InternalUser> = await this.#db.get([
			this.#tableName,
			id,
		])

		return maybeUser.value ?? null
	}

	public async update(
		id: string,
		user: Partial<PublicUser>
	): Promise<Nullable<InternalUser>> {
		const maybeUser: Deno.KvEntryMaybe<InternalUser> = await this.#db.get([
			this.#tableName,
			id,
		])

		if (!maybeUser.value) return null

		const updatedUser = {
			...maybeUser.value,
			...user,
		}

		const pk = [this.#tableName, id]

		if (user.email) {
			const osk = [`${this.#tableName}_by_email`, maybeUser.value.email]
			const sk = [`${this.#tableName}_by_email`, user.email]

			const res = await this.#db
				.atomic() // TODO: Add versionstamp checks
				.delete(osk)
				.set(pk, updatedUser)
				.set(sk, updatedUser)
				.commit()

			return res.ok ? updatedUser : null
		}

		const sk = [`${this.#tableName}_by_email`, maybeUser.value.email]

		const res = await this.#db
			.atomic() // TODO: Add versionstamp checks
			.set(pk, updatedUser)
			.set(sk, updatedUser)
			.commit()

		return res.ok ? updatedUser : null
	}
}

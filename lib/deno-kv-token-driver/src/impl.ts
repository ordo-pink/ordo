import { TokenDriver, TokenMap } from "#lib/token-service/src/types.ts"
import { Nullable } from "#lib/tau/mod.ts"

export class DenoKVTokenDriver implements TokenDriver {
	#db: Deno.Kv

	public static async of(path: string) {
		const db = await Deno.openKv(path)
		return new DenoKVTokenDriver(db)
	}

	protected constructor(db: Deno.Kv) {
		this.#db = db
	}

	public async get(id: string) {
		const result: Deno.KvEntryMaybe<TokenMap> = await this.#db.get([
			"refresh_tokens",
			id,
		])

		return result.value ?? null
	}

	public async set(id: string, map: TokenMap): Promise<Nullable<TokenMap>> {
		const result = await this.#db.set(["refresh_tokens", id], map)

		return result.ok ? map : null
	}

	public async setToken(
		id: string,
		ip: string,
		refreshToken: Nullable<string>
	) {
		const map = (await this.get(id)) ?? ({} as TokenMap)

		map[ip] = refreshToken

		const result = await this.#db.set(["refresh_tokens", id], map)

		return result.ok ? this.get(id) : null
	}
}

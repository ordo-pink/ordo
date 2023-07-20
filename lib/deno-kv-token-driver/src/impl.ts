import {
	JTI,
	SUB,
	TokenAdapter,
	TokenMap,
} from "#lib/token-service/src/types.ts"
import { Nullable } from "#lib/tau/mod.ts"
import { Either, TEither } from "#lib/either/mod.ts"

export class DenoKVTokenAdapter implements TokenAdapter {
	#db: any
	#tableName: string

	public static async of(path: string, tableName: string) {
		const db = await (Deno as any).openKv(path)
		return new DenoKVTokenAdapter(db, tableName)
	}

	protected constructor(db: any, tableName: string) {
		this.#db = db
		this.#tableName = tableName
	}

	public async get(sub: SUB, jti: JTI): Promise<TEither<string, "Not found">> {
		const tokenMapE = await this.getAll(sub)

		return tokenMapE.chain(m =>
			Either.fromNullable(m[jti]).leftMap(() => "Not found")
		)
	}

	public async getAll(sub: SUB): Promise<TEither<TokenMap, "Not found">> {
		const result = await this.#db.get([this.#tableName, sub])

		return Either.fromBooleanLazy(
			() => Boolean(result.value),
			() => result.value,
			() => "Not found"
		)
	}

	public async remove(sub: SUB, jti: JTI): Promise<TEither<"OK", "Not found">> {
		const result = await this.getAll(sub)

		if (result.isLeft) return result.map(() => "OK")

		const map = result.getOrElse(() => ({} as TokenMap))
		const newMap = {} as TokenMap

		for (const key of Object.keys(map)) {
			if (key === jti) continue

			newMap[key] = map[key]
		}

		return this.setAll(sub, newMap)
	}

	public async removeAll(sub: SUB): Promise<TEither<"OK", "Not found">> {
		const result = await this.getAll(sub)

		if (result.isLeft) return result.map(() => "OK")

		return this.setAll(sub, {})
	}

	public async set(
		sub: SUB,
		jti: JTI,
		token: string
	): Promise<TEither<"OK", "Not found">> {
		const result = await this.getAll(sub)

		const map = result.getOrElse(() => ({} as TokenMap))

		map[jti] = token

		return this.setAll(sub, map)
	}

	public async setAll(
		sub: SUB,
		map: TokenMap
	): Promise<TEither<"OK", "Not found">> {
		const res = await this.#db.set([this.#tableName, sub], map)

		return Either.fromBooleanLazy(
			() => res.ok,
			() => "OK",
			() => "Not found"
		)
	}
}

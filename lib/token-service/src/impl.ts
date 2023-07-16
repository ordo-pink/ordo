import {
	TokenDriver,
	TokenServiceOptions,
} from "#lib/token-service/src/types.ts"
import { create, decode, getNumericDate, verify } from "#x/djwt@v2.9.1/mod.ts"
import { Algorithm } from "#x/djwt@v2.9.1/algorithm.ts"
import { TokenMap } from "#lib/token-service/mod.ts"

export type TokenParsed = {
	header: {}
	payload: { sub: string }
	signature: Uint8Array
}

export class TokenService {
	#driver: TokenDriver
	#publicKey: CryptoKey
	#privateKey: CryptoKey
	#alg: Algorithm
	#accessTokenExpireIn: number
	#refreshTokenExpireIn: number

	public static async of(driver: TokenDriver, options: TokenServiceOptions) {
		return new TokenService(driver, options)
	}

	protected constructor(driver: TokenDriver, options: TokenServiceOptions) {
		this.#driver = driver
		this.#privateKey = options.privateKey
		this.#publicKey = options.publicKey
		this.#alg = options.alg
		this.#accessTokenExpireIn = options.accessTokenExpireIn
		this.#refreshTokenExpireIn = options.refreshTokenExpireIn
	}

	public async verify(token: string) {
		return verify(token, this.#publicKey).catch(() => false)
	}

	public decode(token: string) {
		const [header, payload, signature] = decode(token) // TODO: Add types

		return { header, payload, signature } as TokenParsed
	}

	public async get(id: string) {
		return this.#driver.get(id)
	}

	public async remove(id: string, ip?: string) {
		return ip
			? this.#driver.setToken(id, ip, null)
			: this.#driver.set(id, {} as TokenMap)
	}

	public async createAccessToken(
		sub: string,
		uip: string,
		aud = "https://ordo.pink"
	) {
		return create(
			{ alg: this.#alg, type: "JWT" }, // TODO: Extract to env variable
			{
				uip,
				sub,
				aud,
				iat: this.createIAT(),
				jti: this.createJTI(),
				iss: this.createISS(),
				exp: this.createEXP("access"),
			},
			this.#privateKey
		)
	}

	public async createRefreshToken(
		sub: string,
		uip: string,
		aud = "https://ordo.pink"
	) {
		const token = await create(
			{ alg: this.#alg, type: "JWT" }, // TODO: Extract to env variable
			{
				uip,
				sub,
				aud,
				iat: this.createIAT(),
				jti: this.createJTI(),
				iss: this.createISS(),
				exp: this.createEXP("refresh"),
			},
			this.#privateKey
		)

		await this.#driver.setToken(sub, uip, token)

		return token
	}

	private createEXP(type: "access" | "refresh") {
		return getNumericDate(
			"access" ? this.#accessTokenExpireIn : this.#refreshTokenExpireIn
		)
	}

	private createJTI() {
		return crypto.randomUUID()
	}

	private createIAT() {
		return Date.now()
	}

	private createISS() {
		return "https://id.ordo.pink"
	}
}

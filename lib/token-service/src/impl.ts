import {
	TokenAdapter,
	RefreshTokenParsed,
	TokenServiceOptions,
	TokenMap,
	SUB,
	JTI,
	AccessTokenParsed,
	UIP,
} from "./types.ts"
import { create, decode, getNumericDate, verify } from "#x/djwt@v2.9.1/mod.ts"
import { Algorithm } from "#x/djwt@v2.9.1/algorithm.ts"

export class TokenService {
	#driver: TokenAdapter
	#algorithm: Algorithm
	#accessTokenExpireIn: number
	#refreshTokenExpireIn: number
	#accessTokenPublicKey: CryptoKey
	#accessTokenPrivateKey: CryptoKey
	#refreshTokenPublicKey: CryptoKey
	#refreshTokenPrivateKey: CryptoKey

	public static async of(driver: TokenAdapter, options: TokenServiceOptions) {
		return new TokenService(driver, options)
	}

	protected constructor(driver: TokenAdapter, options: TokenServiceOptions) {
		this.#driver = driver
		this.#accessTokenPublicKey = options.keys.access.public
		this.#accessTokenPrivateKey = options.keys.access.private
		this.#refreshTokenPublicKey = options.keys.refresh.public
		this.#refreshTokenPrivateKey = options.keys.refresh.private
		this.#algorithm = options.alg
		this.#accessTokenExpireIn = options.accessTokenExpireIn
		this.#refreshTokenExpireIn = options.refreshTokenExpireIn
	}

	public async verifyAccessToken(token: string): Promise<boolean> {
		const { payload } = this.decode(token)
		const { sub, jti } = payload

		const tokenE = await this.getToken(sub, jti)

		return tokenE.fold(
			() => false,
			() => this.verify(token, this.#accessTokenPublicKey) as Promise<boolean>
		)
	}

	public async verifyRefreshToken(sub: SUB, jti: JTI): Promise<boolean> {
		const tokenE = await this.getToken(sub, jti)

		return tokenE.fold(
			() => false,
			token =>
				this.verify(token, this.#refreshTokenPublicKey) as Promise<boolean>
		)
	}

	public async getToken(sub: SUB, jti: JTI) {
		return this.#driver.get(sub, jti)
	}

	public decode(token: string) {
		const [header, payload, signature] = decode(token)

		return { header, payload, signature } as
			| AccessTokenParsed
			| RefreshTokenParsed
	}

	public async getTokens(sub: SUB) {
		return this.#driver.getAll(sub)
	}

	public async removeAllTokens(sub: SUB) {
		return this.#driver.removeAll(sub)
	}

	public async removeToken(sub: SUB, jti: JTI) {
		return this.#driver.remove(sub, jti)
	}

	public async createAccessToken(
		jti: JTI,
		sub: SUB,
		aud = "https://ordo.pink"
	) {
		const iat = this.createIAT()
		const iss = this.createISS()
		const exp = this.createEXP("access")
		const payload = { sub, aud, jti, iat, iss, exp }

		return create(
			{ alg: this.#algorithm, type: "JWT" },
			payload,
			this.#accessTokenPrivateKey
		)
	}

	public async createRefreshToken(
		sub: SUB,
		uip: UIP,
		aud = "https://ordo.pink"
	) {
		const jti = this.createJTI()
		const iat = this.createIAT()
		const iss = this.createISS()
		const exp = this.createEXP("refresh")
		const payload = { uip, sub, aud, jti, iat, iss, exp }

		const token = await create(
			{ alg: this.#algorithm, type: "JWT" },
			payload,
			this.#refreshTokenPrivateKey
		)

		await this.#driver.set(sub, jti, token)

		return { jti, exp }
	}

	private createEXP(type: "access" | "refresh") {
		return getNumericDate(
			type === "access" ? this.#accessTokenExpireIn : this.#refreshTokenExpireIn
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

	private async verify(token: string, key: CryptoKey) {
		return verify(token, key).catch(() => false)
	}
}

// SPDX-FileCopyrightText: Copyright 2023, Sergei Orlov and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

import type { Header, Payload } from "#x/djwt@v2.9.1/mod.ts"
import type { T as TAU } from "#lib/tau/mod.ts"
import type { T as LoggerTypes } from "#lib/logger/mod.ts"
import type { Oath } from "#lib/oath/mod.ts"

// PUBLIC -----------------------------------------------------------------------------------------

/**
 * A record of refresh token ids and tokens.
 */
export type TokenDict = Record<JTI, string>

/**
 * A pair of CryptoKeys.
 */
export type CryptoKeyPair = {
	/**
	 * Private CryptoKey used for signing.
	 */
	readonly private: CryptoKey

	/**
	 * Public CryptoKey used for verifying.
	 */
	readonly public: CryptoKey
}

/**
 * @see AccessTokenPayload.sub
 */
export type SUB = string

/**
 * @see AccessTokenPayload.aud
 */
export type AUD = string

/**
 * @see AccessTokenPayload.iat
 */
export type IAT = number

/**
 * @see AccessTokenPayload.jti
 */
export type JTI = string

/**
 * @see AccessTokenPayload.iss
 */
export type ISS = string

/**
 * @see AccessTokenPayload.exp
 */
export type EXP = number

/**
 * @see RefreshTokenPayload.uip
 */
export type UIP = string

/**
 * Payload of the access JWT.
 */
export interface AccessTokenPayload extends Payload {
	/**
	 * JWT subject. User id is stored here.
	 */
	readonly sub: SUB

	/**
	 * JWT audience.
	 * @default "https://ordo.pink"
	 */
	readonly aud: AUD

	/**
	 * JWT issue time stamp.
	 */
	readonly iat: IAT

	/**
	 * JWT id. This value is the same for refresh token and access token. This way access token can
	 * be revoked even if its expiration time hasn't come yet.
	 */
	readonly jti: JTI

	/**
	 * JWT issuer.
	 * @default "https://id.ordo.pink"
	 */
	readonly iss: ISS

	/**
	 * JWT expiration time stamp.
	 */
	readonly exp: EXP
}

/**
 * Payload of the refresh JWT.
 */
export interface RefreshTokenPayload extends AccessTokenPayload {
	/**
	 * User IP. This value is only stored in refresh tokens.
	 */
	readonly uip: UIP
}

/**
 * Parsed token content.
 */
export type TokenParsed<TPayload extends Payload = Payload> = {
	/**
	 * @see Header
	 */
	readonly header: Header

	/**
	 * @see Payload
	 */
	readonly payload: TPayload

	/**
	 * JWT signature.
	 * @type {Uint8Array}
	 */
	readonly signature: Uint8Array
}

/**
 * Parsed access token content.
 */
export type AccessTokenParsed = TokenParsed<AccessTokenPayload>

/**
 * Parsed refresh token content.
 */
export type RefreshTokenParsed = TokenParsed<RefreshTokenPayload>

/**
 * Token storage adapter is used as an adapter over a database driver that provides a small set of
 * specific methods that can TokenService will use to store required data. This type defines the
 * list of methods and type-level implementation details of what TokenService provides and what it
 * expects to get back.
 */
export type Adapter = {
	/**
	 * Get token associated with given user id and token id.
	 * @rejects with `null` if no reference to given user id is persisted.
	 * @rejects with `null` if token was not found.
	 * @rejects with `Error` if a database error occurs. Resolves with a token.
	 * @resolves with an Oath of the token for given sub and jti.
	 */
	getToken(sub: SUB, jti: JTI): Oath<string, TAU.Nullable<Error>>

	/**
	 * Get an object that contains mapping of JTIs to corresponding tokens.
	 * @rejects with `null` if no reference to given user id is persisted.
	 * @rejects with `Error` if a database error occurs.
	 * @resolves with a record of JTIs to corresponding tokens.
	 */
	getTokenDict(sub: SUB): Oath<TokenDict, TAU.Nullable<Error>>

	/**
	 * Remove a token associated with given user id and token id.
	 * @rejects with `null` if no reference to given user id is persisted.
	 * @rejects with `Error` if a database error occurs.
	 * @resolves with "OK" if user's token dict did not contain the token hence it was not removed.
	 * @resolves with "OK".
	 */
	removeToken(sub: SUB, jti: JTI): Oath<"OK", TAU.Nullable<Error>>

	/**
	 * Remove token dict of a user under given user id.
	 * @rejects with `null` if no reference to given user id is persisted.
	 * @rejects with `Error` if a database error occurs.
	 * @resolves with "OK".
	 */
	removeTokenDict(sub: SUB): Oath<"OK", TAU.Nullable<Error>>

	/**
	 * Set a token for given user id and token id.
	 * @rejects with `null` if no reference to given user id is persisted.
	 * @rejects with `Error` if a database error occurs.
	 * @resolves with "OK".
	 */
	setToken(sub: SUB, jti: JTI, token: string): Oath<"OK", TAU.Nullable<Error>>

	/**
	 * Set token dict for a user under given user id.
	 * @rejects with `null` if no reference to given user id is persisted.
	 * @rejects with `Error` if a database error occurs.
	 * @resolves with "OK"
	 */
	setTokenDict(sub: SUB, map: TokenDict): Oath<"OK", TAU.Nullable<Error>>
}

/**
 * Options for configuring TokenService on creation.
 */
export type TokenServiceOptions = {
	/**
	 * A chain of CryptoKeys for signing and verifying tokens.
	 */
	readonly keys: {
		/**
		 * Access token CryptoKeys.
		 */
		readonly access: CryptoKeyPair

		/**
		 * Refresh token CryptoKeys.
		 */
		readonly refresh: CryptoKeyPair
	}

	/**
	 * TODO: Add support for switching to other algorithms.
	 */
	readonly alg: "ES384"

	/**
	 * Lifetime of an access token in seconds.
	 */
	readonly accessTokenExpireIn: number

	/**
	 * Lifetime of a refresh token in seconds.
	 */
	readonly refreshTokenExpireIn: number

	/**
	 * TODO: Add logger and propper logging of errors
	 */
	readonly logger: LoggerTypes.Logger
}

/**
 * TokenService is used for working with tokens. It's main purpose is to create, verify, and decode
 * tokens, and provide CRUD access to the tokens in the storage. The storage can be overriden with
 * a TokenStorageAdapter that is accepted by TokenService as an argument. Provided adapter will be
 * used for storing and retrieving tokens wherever they are stored (this is controlled solely by
 * the TokenStorageDriver). Other options for TokenService can be configured via the options
 * provided as the second argument.
 *
 * @see Adapter
 */
export type TokenService = {
	/**
	 * Verify given access token.
	 * @resolves with `true` if the token is valid.
	 * @resolves with `false` otherwise.
	 */
	verifyAccessToken: TAU.Unary<string, Oath<boolean, never>>

	/**
	 * Verify given refresh token.
	 * @resolves with `true` if the token is valid.
	 * @resolves with `false` otherwise.
	 * @rejects `never`.
	 */
	verifyRefreshToken: TAU.Unary<string, Oath<boolean, never>>

	/**
	 * Get payload of a given access token.
	 * @resolves with `AccessTokenPayload` if the token is valid.
	 * @rejects with `null` otherwise.
	 */
	getAccessTokenPayload: TAU.Unary<string, Oath<AccessTokenPayload, null>>

	/**
	 * Get payload of a given refresh token.
	 * @resolves with `RefreshTokenPayload` if the token is valid.
	 * @rejects with `null` otherwise.
	 */
	getRefreshTokenPayload: TAU.Unary<string, Oath<RefreshTokenPayload, null>>

	/**
	 * Get parsed access token content from given token.
	 * @resolves with `AccessTokenParsed` if the token is valid.
	 * @rejects with `null` otherwise.
	 */
	decodeAccessToken: TAU.Unary<string, Oath<AccessTokenParsed, null>>

	/**
	 * Get parsed refresh token content from given token.
	 * @resolves with `RefreshTokenParsed` if the token is valid.
	 * @rejects with `null` otherwise.
	 */
	decodeRefreshToken: TAU.Unary<string, Oath<RefreshTokenParsed, null>>

	/**
	 * Create a pair of tokens for given user id.
	 * @resolves with a record of tokens after removing old JTI and persisting new JTI-token pair.
	 * @rejects with `null` otherwise.
	 */
	createTokens: TAU.Unary<_CreateTokensParams, Oath<_CreatedTokens, null>>

	/**
	 * Get a refresh token for given user id and token id.
	 * @resolves with refresh token if such token was persisted.
	 * @rejects with `null` otherwise.
	 */
	getPersistedToken: TAU.Binary<SUB, JTI, Oath<string, null>>

	/**
	 * Get a token dict for given user id.
	 * @resolves with `TokenDict` if such token dict was persisted.
	 * @rejects with `null` otherwise.
	 */
	getPersistedTokenDict: TAU.Unary<SUB, Oath<TokenDict, null>>

	/**
	 * Remove a token for given user id and token id.
	 * @resolves with `"OK"` if token was removed or the user token dict did not have such token.
	 * @rejects with `null` otherwise.
	 */
	removePersistedToken: TAU.Binary<SUB, JTI, Oath<"OK", null>>

	/**
	 * Remove a token dict for given user id.
	 * @resolves with `"OK"` if token dict was removed or token dict for such user did not exist.
	 * @rejects with `null` otherwise.
	 */
	removePersistedTokenDict: TAU.Unary<SUB, Oath<"OK", null>>

	/**
	 * Set a token for given user id and token id.
	 * @resolves with `"OK"` if token was set.
	 * @rejects with `null` otherwise.
	 */
	setPersistedToken: TAU.Ternary<SUB, JTI, string, Oath<"OK", null>>

	/**
	 * Set a token dict for given user id.
	 * @resolves with `"OK"` if token dict was set.
	 * @rejects with `null` otherwise.
	 */
	setPersistedTokenDict: TAU.Binary<SUB, TokenDict, Oath<"OK", null>>
}

// INTERNAL ---------------------------------------------------------------------------------------

export type _CreateTokensParams = { sub: SUB; uip: UIP; prevJti: JTI; aud?: AUD }
export type _CreatedTokens = RefreshTokenPayload & { access: string; refresh: string }
export type _Props = { adapter: Adapter; options: TokenServiceOptions }
export type _Fn = (props: _Props) => TokenService
export type _GetTokenPayloadFn<T> = (key: CryptoKey) => TAU.Unary<string, Oath<T, null>>
export type _DecodePayloadFn<T extends TokenParsed> = TAU.Unary<string, Oath<T, null>>
export type _GetTokenFn = TAU.Unary<Adapter, TokenService["getPersistedToken"]>
export type _GetTokenDictFn = TAU.Unary<Adapter, TokenService["getPersistedTokenDict"]>
export type _RemoveTokenFn = TAU.Unary<Adapter, TokenService["removePersistedToken"]>
export type _RemoveTokenDictFn = TAU.Unary<Adapter, TokenService["removePersistedTokenDict"]>
export type _SetTokenFn = TAU.Unary<Adapter, TokenService["setPersistedToken"]>
export type _SetTokenDictFn = TAU.Unary<Adapter, TokenService["setPersistedTokenDict"]>
export type _CreateEXPFn = TAU.Unary<number, EXP>
export type _CreateJTIFn = TAU.Thunk<JTI>
export type _CreateIATFn = TAU.Thunk<IAT>
export type _CreateISSFn = TAU.Thunk<ISS>
export type _VerifyToken = TAU.Curry<TAU.Binary<CryptoKey, string, Oath<boolean, never>>>
export type _CreateTokensFn = TAU.Unary<_Props, TokenService["createTokens"]>

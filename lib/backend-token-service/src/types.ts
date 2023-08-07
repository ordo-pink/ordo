// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Header, Payload } from "#x/djwt@v2.9.1/mod.ts"
import type { Oath } from "#lib/oath/mod.ts"
import type { Nullable, Unary, Binary, Ternary, Thunk, Curry } from "#lib/tau/mod.ts"
import type { Logger } from "#lib/logger/mod.ts"

// PUBLIC -----------------------------------------------------------------------------------------

/**
 * A record of refresh token ids and tokens.
 */
export type TokenRecord = Record<JTI, string>

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
export type TokenRepository = {
	/**
	 * Get token associated with given user id and token id.
	 * @rejects with `null` if no reference to given user id is persisted.
	 * @rejects with `null` if token was not found.
	 * @rejects with `Error` if a database error occurs. Resolves with a token.
	 * @resolves with an Oath of the token for given sub and jti.
	 */
	getToken(sub: SUB, jti: JTI): Oath<string, Nullable<Error>>

	/**
	 * Get an object that contains mapping of JTIs to corresponding tokens.
	 * @rejects with `null` if no reference to given user id is persisted.
	 * @rejects with `Error` if a database error occurs.
	 * @resolves with a record of JTIs to corresponding tokens.
	 */
	getTokenRecord(sub: SUB): Oath<TokenRecord, Nullable<Error>>

	/**
	 * Remove a token associated with given user id and token id.
	 * @rejects with `null` if no reference to given user id is persisted.
	 * @rejects with `Error` if a database error occurs.
	 * @resolves with "OK" if user's token record did not contain the token hence it was not removed.
	 * @resolves with "OK".
	 */
	removeToken(sub: SUB, jti: JTI): Oath<"OK", Nullable<Error>>

	/**
	 * Remove token record of a user under given user id.
	 * @rejects with `null` if no reference to given user id is persisted.
	 * @rejects with `Error` if a database error occurs.
	 * @resolves with "OK".
	 */
	removeTokenRecord(sub: SUB): Oath<"OK", Nullable<Error>>

	/**
	 * Set a token for given user id and token id.
	 * @rejects with `null` if no reference to given user id is persisted.
	 * @rejects with `Error` if a database error occurs.
	 * @resolves with "OK".
	 */
	setToken(sub: SUB, jti: JTI, token: string): Oath<"OK", Nullable<Error>>

	/**
	 * Set token record for a user under given user id.
	 * @rejects with `null` if no reference to given user id is persisted.
	 * @rejects with `Error` if a database error occurs.
	 * @resolves with "OK"
	 */
	setTokenRecord(sub: SUB, map: TokenRecord): Oath<"OK", Nullable<Error>>
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
	readonly logger: Logger
}

/**
 * TokenService is used for working with tokens. It's main purpose is to create, verify, and decode
 * tokens, and provide CRUD access to the tokens in the storage. The storage can be overriden with
 * a TokenStorageAdapter that is accepted by TokenService as an argument. Provided adapter will be
 * used for storing and retrieving tokens wherever they are stored (this is controlled solely by
 * the TokenStorageDriver). Other options for TokenService can be configured via the options
 * provided as the second argument.
 *
 * @see TokenRepository
 */
export type TTokenService = {
	/**
	 * Verify given access token.
	 * @resolves with `true` if the token is valid.
	 * @resolves with `false` otherwise.
	 */
	verifyAccessToken: Unary<string, Oath<boolean, never>>

	/**
	 * Verify given refresh token.
	 * @resolves with `true` if the token is valid.
	 * @resolves with `false` otherwise.
	 * @rejects `never`.
	 */
	verifyRefreshToken: Unary<string, Oath<boolean, never>>

	/**
	 * Get payload of a given access token.
	 * @resolves with `AccessTokenPayload` if the token is valid.
	 * @rejects with `null` otherwise.
	 */
	getAccessTokenPayload: Unary<string, Oath<AccessTokenPayload, null>>

	/**
	 * Get payload of a given refresh token.
	 * @resolves with `RefreshTokenPayload` if the token is valid.
	 * @rejects with `null` otherwise.
	 */
	getRefreshTokenPayload: Unary<string, Oath<RefreshTokenPayload, null>>

	/**
	 * Get parsed access token content from given token.
	 * @resolves with `AccessTokenParsed` if the token is valid.
	 * @rejects with `null` otherwise.
	 */
	decodeAccessToken: Unary<string, Oath<AccessTokenParsed, null>>

	/**
	 * Get parsed refresh token content from given token.
	 * @resolves with `RefreshTokenParsed` if the token is valid.
	 * @rejects with `null` otherwise.
	 */
	decodeRefreshToken: Unary<string, Oath<RefreshTokenParsed, null>>

	/**
	 * Create a pair of tokens for given user id.
	 * @resolves with a record of tokens after removing old JTI and persisting new JTI-token pair.
	 * @rejects with `null` otherwise.
	 */
	createTokens: Unary<_CreateTokensParams, Oath<_CreatedTokens, null>>

	/**
	 * Get a refresh token for given user id and token id.
	 * @resolves with refresh token if such token was persisted.
	 * @rejects with `null` otherwise.
	 */
	getPersistedToken: Binary<SUB, JTI, Oath<string, null>>

	/**
	 * Get a token record for given user id.
	 * @resolves with `TokenDict` if such token record was persisted.
	 * @rejects with `null` otherwise.
	 */
	getPersistedTokens: Unary<SUB, Oath<TokenRecord, null>>

	/**
	 * Remove a token for given user id and token id.
	 * @resolves with `"OK"` if token was removed or the user token record did not have such token.
	 * @rejects with `null` otherwise.
	 */
	removePersistedToken: Binary<SUB, JTI, Oath<"OK", null>>

	/**
	 * Remove a token record for given user id.
	 * @resolves with `"OK"` if token record was removed or token record for such user did not exist.
	 * @rejects with `null` otherwise.
	 */
	removePersistedTokens: Unary<SUB, Oath<"OK", null>>

	/**
	 * Set a token for given user id and token id.
	 * @resolves with `"OK"` if token was set.
	 * @rejects with `null` otherwise.
	 */
	setPersistedToken: Ternary<SUB, JTI, string, Oath<"OK", null>>

	/**
	 * Set a token record for given user id.
	 * @resolves with `"OK"` if token record was set.
	 * @rejects with `null` otherwise.
	 */
	setPersistedTokens: Binary<SUB, TokenRecord, Oath<"OK", null>>
}

// INTERNAL ---------------------------------------------------------------------------------------

export type _CreateTokensParams = { sub: SUB; uip: UIP; prevJti?: JTI; aud?: AUD }
export type _CreatedTokens = RefreshTokenPayload & { access: string; refresh: string }
export type _Props = { repository: TokenRepository; options: TokenServiceOptions }
export type _Fn = (props: _Props) => TTokenService
export type _GetTokenPayloadFn<T> = (params: {
	key: CryptoKey
	repository: TokenRepository
}) => Unary<string, Oath<T, null>>
export type _DecodePayloadFn<T extends TokenParsed> = Unary<string, Oath<T, null>>
export type _GetTokenFn = Unary<TokenRepository, TTokenService["getPersistedToken"]>
export type _GetTokenRecordFn = Unary<TokenRepository, TTokenService["getPersistedTokens"]>
export type _RemoveTokenFn = Unary<TokenRepository, TTokenService["removePersistedToken"]>
export type _RemoveTokenRecordFn = Unary<TokenRepository, TTokenService["removePersistedTokens"]>
export type _SetTokenFn = Unary<TokenRepository, TTokenService["setPersistedToken"]>
export type _SetTokenRecordFn = Unary<TokenRepository, TTokenService["setPersistedTokens"]>
export type _CreateEXPFn = Unary<number, EXP>
export type _CreateJTIFn = Thunk<JTI>
export type _CreateIATFn = Thunk<IAT>
export type _CreateISSFn = Thunk<ISS>
export type _VerifyToken = Curry<
	Binary<
		{
			key: CryptoKey
			repository: TokenRepository
		},
		string,
		Oath<boolean, never>
	>
>
export type _CreateTokensFn = Unary<_Props, TTokenService["createTokens"]>

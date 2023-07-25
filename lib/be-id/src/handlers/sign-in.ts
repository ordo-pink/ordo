// SPDX-FileCopyrightText: Copyright 2023, Sergei Orlov and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

import type { Context, Middleware } from "#x/oak@v12.6.0/mod.ts"
import type { EXP, JTI, SUB, TokenService, UIP } from "#lib/token-service/mod.ts"
import type { User, UserService } from "#lib/user-service/mod.ts"

import { ResponseError } from "#lib/be-use/mod.ts"
import { useBody } from "#lib/be-use/mod.ts"
import { thunkify } from "#lib/tau/mod.ts"
import { Oath } from "#lib/oath/mod.ts"

// Public -----------------------------------------------------------------------------------------

type Body = { email?: string; password?: string }
type Params = { userService: UserService; tokenService: TokenService }
type Fn = (params: Params) => Middleware

export const handleSignIn: Fn =
	({ userService, tokenService }) =>
	ctx =>
		Oath.from(() => useBody<Body>(ctx))
			.chain(validateEmailAndPassword({ userService }))
			.chain(createJSONWebTokens({ tokenService, ctx }))
			.chain(createSignInCookies(ctx))
			.fork(ResponseError.send(ctx), sendSignInInfo(ctx))

// Internal ---------------------------------------------------------------------------------------

// Types ------------------------------------------------------------------------------------------

type TokenInfo = {
	accessToken: string
	jti: JTI
	exp: EXP
	sub: SUB
}

// Impl -------------------------------------------------------------------------------------------

// Get validated user from email and password -----------------------------------------------------

type TValidateFnParams = Pick<Params, "userService">
type TValidateFn = (p: TValidateFnParams) => (b: Body) => Oath<User, [number, string]>

const validateEmailAndPassword: TValidateFn =
	({ userService }) =>
	({ email, password }) =>
		Oath.all({ email: Oath.fromNullable(email), password: Oath.fromNullable(password) })
			.rejectedMap(ResponseError.create(400, "Invalid body content"))
			.chain(getValidatedUser(userService))
			.bimap(ResponseError.create(404, "User not found"), extractUser)

// Create JSON Web Tokens -------------------------------------------------------------------------

type TCreateTokensFnParams = Pick<Params, "tokenService"> & { ctx: Context }
type TCreateTokensFn = (x: TCreateTokensFnParams) => (u: User) => Oath<TokenInfo>

const createJSONWebTokens: TCreateTokensFn =
	({ ctx, tokenService }) =>
	user =>
		Oath.of({ sub: user.id, uip: ctx.request.ip })
			.chain(createRefreshToken(tokenService))
			.chain(createAccessToken(tokenService))

// Set cookies related to user sign in ------------------------------------------------------------

type TCreateCookiesFn = (ctx: Context) => (info: TokenInfo) => Oath<TokenInfo>

const createSignInCookies: TCreateCookiesFn = ctx => tokenInfo =>
	Oath.all([
		setSignInCookie("jti", tokenInfo.jti, tokenInfo.exp, ctx),
		setSignInCookie("sub", tokenInfo.sub, tokenInfo.exp, ctx),
	]).map(thunkify(tokenInfo))

// Set token data to the response body ------------------------------------------------------------

type TSendInfoFnParams = Omit<TokenInfo, "exp">
type TSendInfoFn = (ctx: Context) => (info: TSendInfoFnParams) => void

const sendSignInInfo: TSendInfoFn =
	ctx =>
	({ accessToken, jti, sub }) => {
		ctx.response.body = { accessToken, jti, sub }
	}

// Internal ---------------------------------------------------------------------------------------

const extractUser = ({ user }: { user: User }) => user

const getUser = (userService: UserService, email: string) => userService.getByEmail(email)

const createRefreshToken =
	(tokenService: TokenService) =>
	({ sub, uip }: { sub: SUB; uip: UIP }) =>
		Oath.from(() => tokenService.createRefreshToken(sub, uip)).map(({ jti, exp }) => ({
			sub,
			uip,
			jti,
			exp,
		}))

const createAccessToken =
	(tokenService: TokenService) =>
	({ exp, jti, sub }: Omit<TokenInfo, "accessToken">) =>
		Oath.all({
			accessToken: tokenService.createAccessToken(jti, sub),
			exp,
			jti,
			sub,
		})

const getValidatedUser =
	(userService: UserService) =>
	({ email, password }: { email: string; password: string }) =>
		Oath.all({
			user: getUser(userService, email),
			ok: userService.comparePassword(email, password),
		})

const setSignInCookie = (name: "sub" | "jti", value: string, exp: EXP, ctx: Context) =>
	ctx.cookies.set(name, value, {
		httpOnly: true,
		sameSite: "lax",
		expires: new Date(Date.now() + exp),
	})

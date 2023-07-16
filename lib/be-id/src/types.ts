import {
	Middleware,
	RouterContext,
	RouterMiddleware,
} from "#x/oak@v12.6.0/mod.ts"
import { TokenService } from "#lib/token-service/mod.ts"
import { UserService } from "#lib/user-service/mod.ts"

export type RefreshTokenBody = {
	refreshToken?: string
}

export type SignInBody = {
	email?: string
	password?: string
}

export type SignUpBody = {
	email?: string
	password?: string
}

export type ChangeEmailBody = {
	email?: string
}

export type ChangePasswordBody = {
	oldPassword?: string
	newPassword?: string
}

export type HandleRefreshTokenFnParams = {
	userService: UserService
	tokenService: TokenService
}

export type HandleRefreshTokenFn = (
	params: HandleRefreshTokenFnParams
) => Middleware

export type HandleSignInFnParams = {
	userService: UserService
	tokenService: TokenService
}

export type HandleSignInFn = (params: HandleSignInFnParams) => Middleware

export type HandleSignOutFnParams = {
	userService: UserService
	tokenService: TokenService
}

export type HandleSignOutFn = (params: HandleSignOutFnParams) => Middleware

export type HandleSignUpFnParams = {
	userService: UserService
	tokenService: TokenService
}

export type HandleSignUpFn = (params: HandleSignUpFnParams) => Middleware

export type HandleAccountFnParams = {
	tokenService: TokenService
	userService: UserService
}

export type HandleAccountFn = (params: HandleAccountFnParams) => Middleware

export type HandleUserInfoFnParams = {
	tokenService: TokenService
	userService: UserService
}

export type HandleUserInfoFn = (
	params: HandleUserInfoFnParams
) => RouterMiddleware<"/users/:email">

export type ChangePasswordFnParams = {
	tokenService: TokenService
	userService: UserService
}

export type ChangePasswordFn = (params: ChangePasswordFnParams) => Middleware

export type ChangeEmailFnParams = {
	tokenService: TokenService
	userService: UserService
}

export type ChangeEmailFn = (params: ChangeEmailFnParams) => Middleware

// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

export type WebsiteEndpoints =
	| "SignIn"
	| "SignUp"
	| "SignOut"
	| "ConfirmEmail"
	| "PrivacyPolicy"
	| "ResetPassword"
	| "ForgotPassword"

export type ExternalEndpoints = "TelegramSupportCIS" | "SourceCode" | "TwitterX" | "License"

export type RouteHandlerDefinition = {
	method: string
	url: string
}

export type RouteDefinition = RouteHandlerDefinition & {
	authenticated: boolean
	headers?: Record<string, string>
}

export type OrdoRouteDefinitionContext<
	T extends Record<string, unknown> = Record<string, unknown>,
> = T & { host: string }

export type CreateRequestDefinition<T extends Record<string, unknown> = Record<string, unknown>> = (
	params: OrdoRouteDefinitionContext<T>,
) => RouteDefinition

export type CreateRouteHandler<T extends Record<string, unknown> = Record<string, unknown>> = (
	params: OrdoRouteDefinitionContext<T>,
) => RouteHandlerDefinition

export type OrdoRouteMap<
	Keys extends string,
	T extends Record<string, unknown> = Record<string, unknown>,
> = Record<
	Keys,
	{ createHandler: CreateRouteHandler<T>; prepareRequest: CreateRequestDefinition<T> }
>

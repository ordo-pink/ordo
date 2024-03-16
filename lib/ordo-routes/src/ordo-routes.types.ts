// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

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

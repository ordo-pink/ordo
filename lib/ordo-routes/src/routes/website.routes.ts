/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { OrdoRouteMap, WebsiteEndpoints } from "../ordo-routes.types"

const authenticated = false
const method = "GET"
const SIGN_IN = "/sign-in/"
const SIGN_UP = "/sign-up/"
const SIGN_OUT = "/sign-out/"
const CNF_MAIL = "/confirm-email/"
const PRIV_PLC = "/privacy-policy/"
const RST_PWD = "/reset-password/"
const FRGT_PWD = "/forgot-password/"

export const Website: OrdoRouteMap<WebsiteEndpoints> = {
	SignIn: {
		createHandler: () => ({ method, url: SIGN_IN }),
		prepareRequest: ({ host }) => ({ method, authenticated, url: `${host}${SIGN_IN}` }),
	},
	SignUp: {
		createHandler: () => ({ method, url: SIGN_UP }),
		prepareRequest: ({ host }) => ({ method, authenticated, url: `${host}${SIGN_UP}` }),
	},
	SignOut: {
		createHandler: () => ({ method, url: SIGN_OUT }),
		prepareRequest: ({ host }) => ({ method, authenticated, url: `${host}${SIGN_OUT}` }),
	},
	ConfirmEmail: {
		createHandler: () => ({ method, url: CNF_MAIL }),
		prepareRequest: ({ host }) => ({ method, authenticated, url: `${host}${CNF_MAIL}` }),
	},
	PrivacyPolicy: {
		createHandler: () => ({ method, url: PRIV_PLC }),
		prepareRequest: ({ host }) => ({ method, authenticated, url: `${host}${PRIV_PLC}` }),
	},
	ResetPassword: {
		createHandler: () => ({ method, url: RST_PWD }),
		prepareRequest: ({ host }) => ({ method, authenticated, url: `${host}${RST_PWD}` }),
	},
	ForgotPassword: {
		createHandler: () => ({ method, url: FRGT_PWD }),
		prepareRequest: ({ host }) => ({ method, authenticated, url: `${host}${FRGT_PWD}` }),
	},
}

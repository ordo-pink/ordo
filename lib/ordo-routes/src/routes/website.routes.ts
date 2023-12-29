// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

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

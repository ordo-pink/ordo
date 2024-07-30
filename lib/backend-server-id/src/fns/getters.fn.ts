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

import { isEmail } from "validator"

import { Oath } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/data"
import { is_string } from "@ordo-pink/tau"
import { okpwd } from "@ordo-pink/okpwd"

export const get_body_email0 = (email?: string) =>
	Oath.FromNullable(email)
		.pipe(Oath.ops.chain(email => Oath.If(isEmail(email), { T: () => email })))
		.pipe(Oath.ops.rejected_map(() => einval(`get_email -> email: ${email}`)))

export const get_body_handle0 = (handle?: string) =>
	Oath.FromNullable(handle)
		.pipe(Oath.ops.chain(handle => Oath.If(isEmail(handle), { T: () => handle })))
		.pipe(Oath.ops.rejected_map(() => einval(`get_handle -> handle: ${handle}`)))

export const get_body_password0 = (password?: string) =>
	Oath.FromNullable(password)
		.pipe(Oath.ops.map(okpwd()))
		.pipe(Oath.ops.chain(error => Oath.If(!!error, { T: () => password!, F: () => error })))
		.pipe(Oath.ops.rejected_map(error => einval(`get_password -> error: ${error}`)))

export const get_body_first_name0 = (first_name?: string) =>
	Oath.FromNullable(first_name)
		.pipe(Oath.ops.chain(first_name => Oath.If(is_string(first_name), { T: () => first_name })))
		.pipe(Oath.ops.rejected_map(() => einval(`get_first_name -> first_name: ${first_name}`)))

export const get_body_last_name0 = (last_name?: string) =>
	Oath.FromNullable(last_name)
		.pipe(Oath.ops.chain(last_name => Oath.If(is_string(last_name), { T: () => last_name })))
		.pipe(Oath.ops.rejected_map(() => einval(`get_last_name -> last_name: ${last_name}`)))

const einval = RRR.codes.einval("getters")

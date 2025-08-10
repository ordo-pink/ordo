/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
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

import { type Core, core } from "@ordo-pink/sdk-core"
import { result } from "@ordo-pink/oss-result"

import type * as User from "./user.types"

const serialize_session: User.SerializeSession = session => [session[1], session[2]]

export const serialize_other: User.SerializeOther = user => [user[0], user[1], user[2], user[3]]

export const serialize: User.Serialize = user => [
	user[0],
	user[1],
	user[2],
	user[3],
	user[4],
	user[5],
	obfuscate_email(user[6]),
	user[7],
	user[8].map(serialize_session),
	user[9],
	user[10],
]

export const create: User.Create = (
	email,
	ref,
	name = core.user.default_name(),
	sub = core.user.default_subscription(),
	ifs = [],
	p = null,
) =>
	result
		.of(core.uuid.create())
		.pipe(result.ops.chain(id => result.merge({ id, t: core.timestamp.create(), ref: ref ?? core.user.create_ref(id, email) })))
		.pipe(result.ops.map(({ ref, id, t }) => [id, ref, name, sub, t, t, email, ifs, [], p, []] satisfies User.Instance))
		.cata(result.catas.expect(core.fns.v)) // Never gonna happen

export const has_session: User.HasSession = (sid, user) => user[8].some(s => s[0] === sid)
export const get_session: User.GetSession = (sid, user) => user[8].find(s => s[0] === sid) ?? null

export const obfuscate_email: User.ObfuscateEmail = email => {
	const [local, domain] = email.split("@")

	const top_level_domain_start_index = domain.lastIndexOf(".")

	const higher_level_domains = domain.slice(0, top_level_domain_start_index)
	const top_level_domain = domain.slice(top_level_domain_start_index)

	const local_trim_size = local.length > 5 ? 4 : local.length > 2 ? 2 : 0
	const domain_trim_size = higher_level_domains.length > 5 ? 4 : higher_level_domains.length > 2 ? 2 : 0

	return local
		.slice(0, local_trim_size / 2)
		.concat("*".repeat(local.length - local_trim_size))
		.concat(local_trim_size ? local.slice(-local_trim_size / 2) : "")
		.concat("@")
		.concat(higher_level_domains.slice(0, domain_trim_size / 2))
		.concat("*".repeat(higher_level_domains.length - domain_trim_size))
		.concat(domain_trim_size ? higher_level_domains.slice(-domain_trim_size / 2) : "")
		.concat(top_level_domain) as Core.User.Email
}

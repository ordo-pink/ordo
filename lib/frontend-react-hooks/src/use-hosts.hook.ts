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

import { type TGetHostsFn, type THosts } from "@ordo-pink/core"
import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { O } from "@ordo-pink/option"
import { Result } from "@ordo-pink/result"
import { call_once } from "@ordo-pink/tau"
import { useCurrentFID } from "@ordo-pink/frontend-stream-activities"

import { useOrdoContext } from "./use-ordo-context.hook"

let _id: string
let _dt: string
let _static: string
let _website: string
let _my: string

type TInitHostsFn = (hosts: THosts) => { hosts: THosts; get_hosts: TGetHostsFn }
export const __init_hosts: TInitHostsFn = call_once(hosts => {
	_id = hosts.id
	_dt = hosts.dt
	_static = hosts.static
	_website = hosts.website
	_my = hosts.my

	return { hosts, get_hosts: _get_hosts }
})

const _get_hosts: TGetHostsFn = fid =>
	Result.If(KnownFunctions.check_permissions(fid, { queries: ["hosts.access"] })).cata({
		Ok: () => O.Some(gets_unsafe()),
		Err: () => O.None(),
	})

// TODO: Remove
export const gets_unsafe = () => ({ id: _id, dt: _dt, static: _static, website: _website, my: _my })

// TODO: Remove
export const useHostsUnsafe = () => ({
	id: _id,
	dt: _dt,
	static: _static,
	website: _website,
	my: _my,
})

export const useHosts = () => {
	const fid = useCurrentFID()
	const { get_hosts } = useOrdoContext()

	return get_hosts(fid)
}

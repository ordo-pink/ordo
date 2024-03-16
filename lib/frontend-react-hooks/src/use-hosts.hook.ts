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

import { callOnce } from "@ordo-pink/tau"

let idHost: string
let dtHost: string
let staticHost: string
let websiteHost: string
let myHost: string

export type Hosts = {
	idHost: string
	dtHost: string
	staticHost: string
	websiteHost: string
	myHost: string
}
export const __initHosts = callOnce((hosts: Hosts) => {
	idHost = hosts.idHost
	dtHost = hosts.dtHost
	staticHost = hosts.staticHost
	websiteHost = hosts.websiteHost
	myHost = hosts.myHost
})

// TODO: Require fid
export const getHosts = () => ({ idHost, dtHost, staticHost, websiteHost, myHost })

export const useHosts = () => ({ idHost, dtHost, staticHost, websiteHost, myHost })

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

import { BackendAuth } from "../../backend-au.types"

export type ObfuscateEmail = (email: BackendAuth.Email) => string

export const obfuscate_email: ObfuscateEmail = email => {
	const [localPart, domainPart] = email.split("@")

	const topLevelDomainStartIndex = domainPart.lastIndexOf(".")

	const higherLevelDomain = domainPart.slice(0, topLevelDomainStartIndex)
	const topLevelDomain = domainPart.slice(topLevelDomainStartIndex)

	const localTrimSize = localPart.length > 5 ? 4 : localPart.length > 2 ? 2 : 0
	const domainTrimSize = higherLevelDomain.length > 5 ? 4 : higherLevelDomain.length > 2 ? 2 : 0

	return localPart
		.slice(0, localTrimSize / 2)
		.concat("*".repeat(localPart.length - localTrimSize))
		.concat(localTrimSize ? localPart.slice(-localTrimSize / 2) : "")
		.concat("@")
		.concat(higherLevelDomain.slice(0, domainTrimSize / 2))
		.concat("*".repeat(higherLevelDomain.length - domainTrimSize))
		.concat(domainTrimSize ? higherLevelDomain.slice(-domainTrimSize / 2) : "")
		.concat(topLevelDomain)
}

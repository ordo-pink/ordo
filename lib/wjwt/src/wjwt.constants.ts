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

export const Rrr = {
	INVALORDO_ID_KEY: "Invalid key" as const,
	INVALORDO_ID_TOKEN: "Invalid token" as const,
	INVALORDO_ID_PAYLOAD: "Invalid payload" as const,
	ALG_KEY_MISMATCH: "Algorithm and key mismatch" as const,
	TOKEN_NOT_PROVIDED: "Token not provided" as const,
	VERIFICATION_FAILED: "Verification failed" as const,
}

export type RRRKey = keyof typeof Rrr

export type RRR<Key extends RRRKey> = (typeof Rrr)[Key]

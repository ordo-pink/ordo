// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { createDirectoryIfNotExists0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"
import { getc } from "@ordo-pink/getc"
import { die } from "@ordo-pink/binutil"

const { ORDO_DT_DATA_PATH, ORDO_DT_CONTENT_PATH } = getc([
	"ORDO_DT_DATA_PATH",
	"ORDO_DT_CONTENT_PATH",
])

Oath.all([
	createDirectoryIfNotExists0(ORDO_DT_DATA_PATH),
	createDirectoryIfNotExists0(ORDO_DT_CONTENT_PATH),
]).orElse(die())

// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { createDirectoryIfNotExists0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"
import { getc } from "@ordo-pink/getc"

const { DT_DATA_PATH, DT_METADT_PATH } = getc(["DT_DATA_PATH", "DT_METADT_PATH"])

Oath.all([
	createDirectoryIfNotExists0(DT_DATA_PATH),
	createDirectoryIfNotExists0(DT_METADT_PATH),
]).orElse(console.error)

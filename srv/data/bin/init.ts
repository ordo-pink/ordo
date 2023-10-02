// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { createDirectoryIfNotExists0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"
import { getc } from "@ordo-pink/getc"

const { DATA_DATA_PATH, DATA_METADATA_PATH } = getc(["DATA_DATA_PATH", "DATA_METADATA_PATH"])

Oath.all([
	createDirectoryIfNotExists0(DATA_DATA_PATH),
	createDirectoryIfNotExists0(DATA_METADATA_PATH),
]).orElse(console.error)

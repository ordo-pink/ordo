// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { createDirectoryIfNotExists0 } from "@ordo-pink/fs"
import { getc } from "@ordo-pink/getc"

const { ORDO_STATIC_ROOT } = getc(["ORDO_STATIC_ROOT"])

createDirectoryIfNotExists0(ORDO_STATIC_ROOT).orElse(console.log)

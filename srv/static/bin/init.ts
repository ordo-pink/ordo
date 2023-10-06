// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { createDirectoryIfNotExists0 } from "@ordo-pink/fs"
import { getc } from "@ordo-pink/getc"

const { STATIC_ROOT } = getc(["STATIC_ROOT"])

createDirectoryIfNotExists0(STATIC_ROOT).orElse(console.log)

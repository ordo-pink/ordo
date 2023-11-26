// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

// This file is run with bun when executing "bin/init".
// If you need something to be done before running the app, this is the right place to start.
// If the app does not require any configuration, just remove this file.

import { getc } from "@ordo-pink/getc"
import { createDirectoryIfNotExists0 } from "@ordo-pink/fs"
import { join } from "path"

const { SUBS_CONTENT_PATH, SUBS_DATA_OWNER } = getc(["SUBS_DATA_OWNER", "SUBS_CONTENT_PATH"])

createDirectoryIfNotExists0(join(SUBS_CONTENT_PATH, SUBS_DATA_OWNER)).orElse(console.error)

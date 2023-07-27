// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { RESERVED_JAVASCRIPT_KEYWORDS } from "./impl.ts"

export type ReservedJavaScriptKeyword = (typeof RESERVED_JAVASCRIPT_KEYWORDS)[number]

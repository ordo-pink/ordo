// SPDX-FileCopyrightText: Copyright 2023, Sergei Orlov and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { RESERVED_JAVASCRIPT_KEYWORDS } from "./impl.ts"

export type ReservedJavaScriptKeyword = (typeof RESERVED_JAVASCRIPT_KEYWORDS)[number]

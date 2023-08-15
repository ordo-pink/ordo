// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { assertEquals } from "#std/testing/asserts.ts"
import { libfe } from "./impl.ts"

Deno.test("libfe", () => assertEquals(libfe, "libfe"))

/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"
import { oath_indexeddb } from "./oath-indexeddb.impl"

test("oath-indexeddb should pass", () => {
	expect(oath_indexeddb).toEqual("oath-indexeddb")
})

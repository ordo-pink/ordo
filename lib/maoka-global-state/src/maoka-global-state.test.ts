// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { test, expect } from "bun:test"
import { maokaGlobalState } from "./maoka-global-state.impl"

test("maoka-global-state should pass", () => {
	expect(maokaGlobalState).toEqual("maoka-global-state")
})

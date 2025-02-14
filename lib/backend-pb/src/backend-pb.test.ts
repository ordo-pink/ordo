/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"
import { backend_pb } from "./backend-pb.impl"

test("backend-pb should pass", () => {
	expect(backend_pb).toEqual("backend-pb")
})

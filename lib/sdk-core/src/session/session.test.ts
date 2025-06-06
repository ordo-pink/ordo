/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { describe, expect, it } from "bun:test"

import { session } from "./session.impl"

describe("session", () => {
	const s = session.from_dto(session.create_id(), session.create_timestamp(), "Unknown manufacturer Unknown Device (Unknown)")

	it("should have valid id", () => {
		expect(session.validations.is_id(s.get_id())).toBeTrue()
	})

	// TODO tests
})

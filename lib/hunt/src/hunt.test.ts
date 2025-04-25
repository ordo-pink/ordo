/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import test from "bun:test"

import { hunt } from "./hunt.impl"

test.describe("hunter", () => {
	test.it("should fire shots", () => {
		const x = { hello: "world" }

		const hunter = hunt.begin<{ test: { args: string; ret: boolean } }>()

		hunter.track("test", str => void (x.hello = str))
		hunter.shoot("test", "world1")

		test.expect(x.hello).toBe("world1")
	})

	test.it("should fire a barrage of shots", () => {
		const x = { hello: "world" } as Record<string, string>

		const hunter = hunt.begin<{ test: { args: string; ret: boolean } }>()

		hunter.track("test", str => void (x.hello = str))
		hunter.track("test", str => void (x[str] = str))
		hunter.shoot("test", "world1")

		test.expect(x.world1).toBe("world1")
	})

	test.it("should disengage", () => {
		const x = { hello: "world" } as Record<string, string>

		const hunter = hunt.begin<{ test: { args: string } }>()

		hunter.track("test", str => void (x.hello = str))
		const putdown = hunter.track("test", str => void (x[str] = str))

		putdown()

		hunter.shoot("test", "world1")

		test.expect(x.hello).toBe("world1")
		test.expect(x.world1).toBeUndefined()
	})
})

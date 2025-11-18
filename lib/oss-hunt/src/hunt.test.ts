/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import test from "bun:test"

import { create } from "./hunt.impl"

test.describe("hunter", () => {
	test.it("should fire shots", () => {
		const x = { hello: "world" }

		const hunter = create<{ test: { args: string; ret: boolean } }>()

		hunter.track("test", str => void (x.hello = str))
		hunter.shoot("test", "world1")

		test.expect(x.hello).toBe("world1")
	})

	test.it("should fire a barrage of shots", async () => {
		const x = { hello: "world" } as Record<string, string>

		const hunter = create<{ test: { args: string; ret: boolean } }>()

		hunter.track("test", str => void (x.hello = str))
		hunter.track("test", str => void (x[str] = str))
		await hunter.shoot("test", "world1").to_promise()

		test.expect(x.world1).toBe("world1")
	})

	test.it("should disengage", () => {
		const x = { hello: "world" } as Record<string, string>
		const hunter = create<{ test: { args: string } }>()
		hunter.track("test", str => void (x.hello = str))
		const putdown = hunter.track("test", str => void (x[str] = str))
		putdown()
		hunter.shoot("test", "world1").to_promise()
		test.expect(x.hello).toBe("world1")
		test.expect(x.world1).toBeUndefined()
	})

	test.it("should not require bullet if it is void", () => {
		const hunter = create<{ test: { args: void } }>()

		hunter.shoot("test")
	})

	test.it("should work without type suggestions", async () => {
		const hunter = create<Record<string, { args: any }>>()
		let y = 0

		hunter.track("hey", x => void (y = x))
		await hunter.shoot("hey", 1).to_promise()

		test.expect(y).toBe(1)
	})

	test.it("should promise the prey is shot", () => {
		const x = { hello: "world" } as Record<string, string>
		const hunter = create<{ test: { args: string } }>()
		hunter.track(
			"test",
			str =>
				new Promise(resolve => {
					setTimeout(() => {
						x.hello = str
						resolve()
					}, 200)
				}),
		)
		hunter
			.shoot("test", "world1")
			.to_promise()
			.then(() => test.expect(x.hello).toBe("world1"))

		test.expect(x.hello).toBe("world")
	})
})

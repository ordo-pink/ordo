import test from "bun:test"

import { oath } from "../../oath.impl"

test.describe("oath.catas", () => {
	test.describe("if_ok", () => {
		test.it("should apply given operator before unwrapping if oath resolves", () => {
			const result = oath.of(1).cata(oath.catas.if_ok(x => x + 1))

			test.expect(result).toBe(2)
		})

		test.it("should return a promise if there is a promise in oath pipeline", async () => {
			const result = oath.from_promise(() => Promise.resolve(1)).cata(oath.catas.if_ok(x => x + 1))

			test.expect(result).toBeInstanceOf(Promise)
			test.expect(await result).toBe(2)
		})

		test.it("should return void on rejection", () => {
			const result = oath.reject(1).cata(oath.catas.if_ok(() => 2))

			test.expect(result).toBe(undefined)
		})
	})
})

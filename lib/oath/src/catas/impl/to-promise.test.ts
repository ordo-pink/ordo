import test from "bun:test"

import { oath } from "../../oath.impl"

test.describe("oath.catas", () => {
	test.describe("to_promise", () => {
		test.it("should apply given operator before unwrapping if oath rejects", async () => {
			const result = oath.reject<number, number>(1).cata(oath.catas.to_promise(x => x + 1))

			test.expect(result).toBeInstanceOf(Promise)
			test.expect(await result).toBe(2)
		})

		test.it("should return a promise of resolved value", async () => {
			const result = oath.resolve(1).cata(oath.catas.to_promise(() => 2))

			test.expect(result).toBeInstanceOf(Promise)
			test.expect(await result).toBe(1)
		})
	})
})

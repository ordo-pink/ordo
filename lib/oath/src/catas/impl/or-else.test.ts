import test from "bun:test"

import { oath } from "../../oath.impl"

test.describe("oath.catas", () => {
	test.describe("or_else", () => {
		test.it("should return resolved value", () => {
			const result = oath.of(1).cata(oath.catas.or_else(() => "test"))

			test.expect(result).toBe(1)
		})

		test.it("should return a promise if there is a promise in oath pipeline", async () => {
			const result1 = oath.from_promise(() => Promise.resolve(1)).cata(oath.catas.or_else(() => "test"))
			const result2 = oath
				.of(1)
				.pipe(oath.ops.chain(() => oath.from_promise(() => Promise.reject(1) as unknown as Promise<number>)))
				.cata(oath.catas.or_else(() => "test"))

			test.expect(result1).toBeInstanceOf(Promise)
			test.expect(await result1).toBe(1)
			test.expect(await result2).toBe("test")
		})

		test.it("should apply given operator before unwrapping if oath rejects", () => {
			const result = oath.reject(1).cata(oath.catas.or_else(x => x + 1))

			test.expect(result).toBe(2)
		})
	})
})

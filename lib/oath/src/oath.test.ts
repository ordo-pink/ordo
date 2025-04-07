import { describe, expect, it } from "bun:test"
import { oath } from "./oath.impl"

describe("oath", () => {
	it("should be defined", () => expect(oath).toBeDefined())
	describe("ops", () => it("should be defined", () => expect(oath.ops).toBeDefined()))
	describe("catas", () => it("should be defined", () => expect(oath.catas).toBeDefined()))

	describe("methods", () => {
		describe("cata", () => {
			it("should explode into resolved value if oath resolves", () => {
				const result = oath.of(1).cata(oath.catas.unwrap())
				expect(result).toEqual(1)
			})

			it("should explode into rejected value if oath rejects", () => {
				const result = oath.reject(1).cata(oath.catas.unwrap())
				expect(result).toEqual(1)
			})

			it("should explode into resolved promise if the pipeline contained a promise", async () => {
				const result = oath
					.of(1)
					.pipe(oath.ops.chain(x => oath.from_promise(() => Promise.resolve(x + 1))))
					.pipe(oath.ops.map(x => x + 1))
					.cata(oath.catas.unwrap())
				expect(await result).toEqual(3)
			})

			it("should explode into rejected promise if the pipeline contained a rejected promise", () => {
				const result = oath
					.of(1)
					.pipe(oath.ops.chain(() => oath.from_promise(() => Promise.reject("error"))))
					.cata(oath.catas.to_promise())
				expect(() => result).toThrow("error")
			})
		})

		describe("cancel", () => {
			it("should prevent further piping", () => {
				const o = oath.of(1).pipe(oath.ops.map(x => x + 1))

				o.cancel("test")

				expect(o.pipe(oath.ops.map(x => x + 1)).cata(oath.catas.unwrap())).toEqual(2)
			})
		})
	})
})

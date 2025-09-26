/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import * as test from "bun:test"

import * as oath from "./oath.impl"

test.describe("oath", () => {
	test.it("should be defined", () => test.expect(oath).toBeDefined())
	test.describe("ops", () => test.it("should be defined", () => test.expect(oath.ops).toBeDefined()))
	test.describe("catas", () => test.it("should be defined", () => test.expect(oath.catas).toBeDefined()))

	test.describe("methods", () => {
		test.describe("cata", () => {})

		test.describe("cancel", () => {
			test.it("should prevent further piping", async () => {
				const o = oath.of(1).pipe(oath.ops.map(x => x + 1))

				o.cancel("test")

				test.expect(await o.pipe(oath.ops.map(x => x + 1)).cata(oath.catas.to_promise())).toEqual(2)
			})
		})
	})

	test.describe("oath.constructors", () => {
		test.describe("oath.create", () => {
			test.it("should create a resolved instance of oath if resolve is called", async () => {
				const result = await oath.create<number, number>(resolve => resolve(1)).cata(oath.catas.to_promise())

				test.expect(result).toBe(1)
			})

			test.it("should create a rejected instance of oath if reject is called", async () => {
				const result = () => oath.create<number, string>((_, reject) => reject("test")).cata(oath.catas.to_promise())

				test.expect(result).toThrow("test")
			})

			test.it("should be an oath", () => {
				const result = oath.create(resolve => resolve(1))

				test.expect(result.is_oath).toBeTrue()
			})

			test.it("should be cancellable", async () => {
				const result = oath.create<number, never>(resolve => resolve(1))
				const reason = "Cancelled"

				test.expect(result.is_cancelled).toBeFalse()
				test.expect(result.reason).toBeUndefined()

				result.cancel(reason)

				test.expect(result.reason).toBe(reason)
				test
					.expect(
						await result
							.pipe(oath.ops.map(x => x + 1))
							.pipe(oath.ops.map(x => x + 1))
							.cata(oath.catas.to_promise()),
					)
					.toBe(1)
			})
		})

		test.describe("from_nullable", () => {
			test.it("should resolve with non-nullable value", async () => {
				const result = await oath.from_nullable(0).cata(oath.catas.to_promise())

				test.expect(result).toBe(0)
			})

			test.it("should reject with null if nullish handler is not provided", async () => {
				const result = await oath.from_nullable<number>(null).cata(oath.catas.or_else(() => 1))

				test.expect(result).toBe(1)
			})

			test.it("should reject with handled value if nullish handler is not provided", async () => {
				const result = await oath.from_nullable<number, number>(null, () => 1).cata(oath.catas.unwrap())

				test.expect(result).toBe(1)
			})
		})
	})

	test.describe("oath.catas", () => {
		test.describe("if_ok", () => {
			test.it("should apply given operator before unwrapping if oath resolves", async () => {
				const result = await oath.of(1).cata(oath.catas.if_ok(x => x + 1))

				test.expect(result).toBe(2)
			})

			test.it("should return void on rejection", async () => {
				const result = await oath.reject(1).cata(oath.catas.if_ok(() => 2))

				test.expect(result).toBe(undefined)
			})
		})

		test.describe("noop", () => {
			test.it("should return undefined no matter what", async () => {
				const result1 = await oath.of(1).cata(oath.catas.noop())
				const result2 = await oath.reject(1).cata(oath.catas.noop())

				test.expect(result1).toBe(undefined)
				test.expect(result2).toBe(undefined)
			})

			test.it("should return a promise if there is a promise in oath pipeline", async () => {
				const result = oath.from_promise(() => Promise.resolve(1)).cata(oath.catas.noop())

				test.expect(result).toBeInstanceOf(Promise)
				test.expect(await result).toBe(undefined)
			})
		})

		test.describe("or_else", () => {
			test.it("should return resolved value", async () => {
				const result = await oath.of(1).cata(oath.catas.or_else(() => "test"))

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
				test.expect(await result2).toBe("test" as any)
			})

			test.it("should apply given operator before unwrapping if oath rejects", async () => {
				const result = await oath.reject<number, number>(1).cata(oath.catas.or_else(x => x + 1))

				test.expect(result).toBe(2)
			})
		})

		test.describe("to_promise", () => {
			test.it("should return whatever resolves", async () => {
				const result = await oath.of(1).cata(oath.catas.to_promise())

				test.expect(result).toBe(1)
			})

			test.it("should return a promise if there is a promise in oath pipeline", async () => {
				const result = oath.from_promise(() => Promise.resolve(1)).cata(oath.catas.to_promise())

				test.expect(result).toBeInstanceOf(Promise)
				test.expect(await result).toBe(1)
			})

			test.it("should return whatever rejects", () => {
				const result = () => oath.reject<string>("test").cata(oath.catas.to_promise())

				test.expect(result).toThrow("test")
			})
		})
	})

	test.describe("oath.ops", () => {
		test.describe("map", () => {
			test.it("should be defined", () => test.expect(oath.ops.map).toBeDefined())

			test.it("should map over resolved oath", async () => {
				const result = oath
					.of(1)
					.pipe(oath.ops.map(x => x + 1))
					.cata(oath.catas.to_promise())

				test.expect(await result).toEqual(2)
			})

			test.it("should not map over rejected oath", async () =>
				test
					.expect(
						await oath
							.reject(1)
							.pipe(oath.ops.map(() => 2))
							.cata(oath.catas.unwrap()),
					)
					.toEqual(1),
			)
		})

		test.describe("rejected_map", () => {
			test.it("should be defined", () => test.expect(oath.ops.rmap).toBeDefined())

			test.it("should map over rejected oath", async () =>
				test
					.expect(
						await oath
							.reject<number, number>(1)
							.pipe(oath.ops.rmap(x => x + 1))
							.cata(oath.catas.unwrap()),
					)
					.toEqual(2),
			)

			test.it("should not map over rejected oath", async () =>
				test
					.expect(
						await oath
							.of(1)
							.pipe(oath.ops.rmap(() => 2))
							.cata(oath.catas.to_promise()),
					)
					.toEqual(1),
			)
		})
	})
})

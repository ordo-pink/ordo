import { tsushi } from "./impl.ts"
import { FailedExpectation } from "./types.ts"

const t = tsushi()

t.group("tsushi", ({ group, todo }) => {
	todo("group")

	group("merge", ({ test }) => {
		test("merge should succeed if all the expectations passed", async ({
			expect,
		}) => {
			const okTest = await test(
				"",
				({ expect, merge }) =>
					merge(
						expect(true).toBeTrue(),
						expect(true).toBeTrue(),
						expect(true).toBeTrue()
					),
				{ silent: true }
			)

			return expect(okTest.UNSAFE_get()).toBeTrue()
		})

		test("merge should fail if any of the expectations failed", async ({
			expect,
			merge,
		}) => {
			const failedTest = await test(
				"",
				({ expect, merge }) =>
					merge(
						expect(true).toBeTrue(),
						expect(true).toBeTrue(),
						expect(true).toBeTrue(),
						expect(false).toBeTrue()
					),
				{ silent: true }
			)

			const failedExpectations =
				failedTest.UNSAFE_get() as FailedExpectation<boolean>

			return merge(
				expect(failedExpectations.expected).toBeTrue(),
				expect(failedExpectations.got).toBeFalse()
			)
		})

		test("merge should fail with the first failed expectation", async ({
			expect,
			merge,
		}) => {
			const failedTest = await test(
				"",
				({ expect, merge }) =>
					merge(
						expect(false).toBeTrue(),
						expect(1).toBeTrue(),
						expect(true).toBeTrue(),
						expect(true).toBeTrue()
					),
				{ silent: true }
			)

			const failedExpectations =
				failedTest.UNSAFE_get() as FailedExpectation<boolean>

			return merge(
				expect(failedExpectations.expected).toBeTrue(),
				expect(failedExpectations.got).toBeFalse()
			)
		})
	})

	group("test", ({ test }) => {
		test("test should succeed if the test passed", async ({ expect }) => {
			const okTest = await test("", ({ expect }) => expect(true).toBeTrue(), {
				silent: true,
			})

			return expect(okTest.UNSAFE_get()).toBeTrue()
		})

		test("test should fail with failed expectations if the test failed", async ({
			expect,
			merge,
		}) => {
			const failedTest = await test(
				"",
				({ expect }) => expect(false).toBeTrue(),
				{ silent: true }
			)

			const failedExpectations =
				failedTest.UNSAFE_get() as FailedExpectation<boolean>

			return merge(
				expect(failedExpectations.expected).toBeTrue(),
				expect(failedExpectations.got).toBeFalse()
			)
		})
	})

	group("expect", ({ test, todo }) => {
		todo("pass")
		todo("fail")
		todo("toEqual")
		todo("toBeInstanceOf")
		todo("toBeTruthy")
		todo("toBeFalsy")
		todo("toBeNullish")
		todo("toBeObject")
		todo("toBeArray")
		todo("toBeNull")
		todo("toBeUndefined")
		todo("toBeBoolean")
		todo("toBeNumber")
		todo("toBeBigInt")
		todo("toBeString")
		todo("toBeSymbol")
		todo("toBeDate")
		todo("toBeFunction")

		test("toBeTrue should succeed if provided value is exactly true", async ({
			expect,
			merge,
		}) => {
			const trueExpectation = await expect(true).toBeTrue()
			const falseExpectation = await expect(false).toBeTrue()
			const truthyExpectation = await expect(1).toBeTrue()

			return merge(
				expect(trueExpectation.UNSAFE_get()).toEqual(true),
				expect(falseExpectation.getOrElse(() => false)).toEqual(false),
				expect(truthyExpectation.getOrElse(() => false)).toEqual(false)
			)
		})

		test("toBeFalse should succeed if provided value is exactly false", async ({
			expect,
			merge,
		}) => {
			const trueExpectation = await expect(true).toBeFalse()
			const falseExpectation = await expect(false).toBeFalse()
			const falsyExpectation = await expect(0).toBeFalse()

			return merge(
				expect(falseExpectation.UNSAFE_get()).toEqual(true),
				expect(trueExpectation.getOrElse(() => false)).toEqual(false),
				expect(falsyExpectation.getOrElse(() => false)).toEqual(false)
			)
		})
	})
})

import { tsushi } from "#lib/tsushi/mod.ts"
import { lazySwitch, Switch } from "./impl.ts"

const t = tsushi()

t.group("switch", ({ group }) => {
	group("Switch", ({ test }) => {
		test("should apply fall into case if the value matches", ({ expect }) =>
			expect(
				Switch.of(1)
					.case(1, () => true)
					.default(() => false)
			).toEqual(true))

		test("should apply fall into case if the validation succeeded", ({
			expect,
		}) =>
			expect(
				Switch.of(1)
					.case(
						x => x === 1,
						() => true
					)
					.default(() => false)
			).toEqual(true))

		test("should apply fall into default none of the cases succeeded", ({
			expect,
		}) =>
			expect(
				Switch.of(2)
					.case(1, () => false)
					.case(3, () => false)
					.default(() => true)
			).toEqual(true))

		test("should apply the first case where the value matched", ({ expect }) =>
			expect(
				Switch.of(1)
					.case(1, () => true)
					.case(1, () => false)
					.default(() => false)
			).toEqual(true))
	})

	group("lazySwitch", ({ test }) => {
		test("should allow assigning switch behaviour before the context argument is provided", ({
			expect,
		}) => {
			const run = lazySwitch<number>(s =>
				s
					.case(
						n => n > 1,
						() => true
					)
					.case(
						n => n < 2,
						() => false
					)
					.default(() => null)
			)

			return expect(run(1.5)).toEqual(true)
		})
	})
})

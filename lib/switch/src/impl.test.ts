import { Switch } from "./impl.ts"

import { assertEquals } from "#std/testing/asserts.ts"

Deno.test("should apply fall into case if the value matches", () =>
	assertEquals(
		Switch.of(1)
			.case(1, () => true)
			.default(() => false),
		true
	)
)

Deno.test("should apply fall into case if the validation succeeded", () =>
	assertEquals(
		Switch.of(1)
			.case(
				x => x === 1,
				() => true
			)
			.default(() => false),
		true
	)
)

Deno.test("should apply fall into default none of the cases succeeded", () =>
	assertEquals(
		Switch.of(2)
			.case(1, () => false)
			.case(3, () => false)
			.default(() => true),
		true
	)
)

Deno.test("should apply the first case where the value matched", () =>
	assertEquals(
		Switch.of(1)
			.case(1, () => true)
			.case(1, () => false)
			.default(() => false),
		true
	)
)

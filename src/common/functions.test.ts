import test from "ava"

import { id, tap } from "./functions"

test("id should return whatever argument was provided to it", (t) => {
	t.is(id(1), 1)
})

test("tap should apply the function and return whatever argument was provided to it", (t) => {
	let testValue = 0

	const updateTestValue = () => void testValue++

	t.is(tap(updateTestValue)(1), 1)
	t.is(testValue, 1)
})

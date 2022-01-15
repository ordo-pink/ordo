import test from "ava"

import { id } from "./functions"

test("id should return whatever argument was provided to it", (t) => {
	t.is(id(1), 1)
})

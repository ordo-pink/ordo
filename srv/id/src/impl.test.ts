import { tsushi } from "#lib/tsushi/mod.ts"

const t = tsushi()

t.group("id", ({ test, todo }) => {
	test("should pass", ({ expect }) => expect().toPass())
})

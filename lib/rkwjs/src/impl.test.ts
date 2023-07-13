import { tsushi } from "#lib/tsushi/mod.ts"

const t = tsushi()

t.group("rkwjs", ({ test, todo }) => {
	test("should pass", ({ expect }) => expect().toPass())
})

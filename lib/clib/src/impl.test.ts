import { tsushi } from "#lib/tsushi/mod.ts"

const t = tsushi()

t.group("clib", ({ test }) => {
	test("should pass", ({ expect }) => expect().toPass())
})

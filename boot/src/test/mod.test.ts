import { tsushi } from "#lib/tsushi/mod.ts"

const t = tsushi()

t.group("test", ({ test }) => {
	test("should pass", ({ expect }) => expect().toPass())
})

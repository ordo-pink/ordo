import { tsushi } from "#lib/tsushi/mod.ts"

const t = tsushi()

t.group("iro", ({ test }) => {
	test("should pass", ({ expect }) => expect().toPass())
})

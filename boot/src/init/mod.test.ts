import { tsushi } from "#lib/tsushi/mod.ts"

const t = tsushi()

t.group("Init", ({ test }) => {
	test("should pass", ({ expect }) => expect().toPass())
})

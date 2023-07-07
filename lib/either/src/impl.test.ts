import { tsushi } from "#lib/tsushi/mod.ts"

const t = tsushi()

t.group("either", ({ test }) => {
	test("should pass", ({ expect }) => expect().toPass())
})

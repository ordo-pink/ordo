import { tsushi } from "#lib/tsushi/mod.ts"

const t = tsushi()

t.group("be-id", ({ test }) => {
	test("should pass", ({ expect }) => expect().toPass())
})

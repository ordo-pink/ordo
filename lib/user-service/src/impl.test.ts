import { tsushi } from "#lib/tsushi/mod.ts"

const t = tsushi()

t.group("user-service", ({ test }) => {
	test("should pass", ({ expect }) => expect().toPass())
})

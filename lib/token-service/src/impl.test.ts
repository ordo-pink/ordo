import { tsushi } from "#lib/tsushi/mod.ts"

const t = tsushi()

t.group("token-service", ({ test }) => {
	test("should pass", ({ expect }) => expect().toPass())
})

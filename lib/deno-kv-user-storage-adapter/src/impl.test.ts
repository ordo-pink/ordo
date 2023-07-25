import { tsushi } from "#lib/tsushi/mod.ts"

const t = tsushi()

t.group("deno-kv-user-driver", ({ test }) => {
	test("should pass", ({ expect }) => expect().toPass())
})

import { tsushi } from "#lib/tsushi/mod.ts"

const t = tsushi()

t.group("Init", ({ test, todo }) => {
  todo("add real tests")
	test("should pass", ({ expect }) => expect().toPass())
})

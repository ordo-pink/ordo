import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

export const CommandPalette = (ctx: Ordo.CreateFunction.Params) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaOrdo.Context.provide(ctx))

		use(MaokaJabs.add_class("text-xl"))

		return () => "HELLO"
	})

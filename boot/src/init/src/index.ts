import { invokers0 } from "@ordo-pink/oath"

import { compile_bin } from "./_compile-bin"
import { init_srv } from "./_init-srv"

export const init = () =>
	compile_bin()
		.and(() => init_srv())
		.invoke(invokers0.or_nothing)

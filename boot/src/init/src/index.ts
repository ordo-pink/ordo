// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { invokers0 } from "@ordo-pink/oath"

import { compile_bin } from "./_compile-bin"
import { init_srv } from "./_init-srv"

export const init = () =>
	compile_bin()
		.and(() => init_srv())
		.invoke(invokers0.or_nothing)

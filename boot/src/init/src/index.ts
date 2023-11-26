// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

// import { createSymlinks } from "./_create-symlinks"
import { compileBin } from "./_compile-bin"
import { initSrv } from "./_init-srv"
// import { runBunCommand0 } from "@ordo-pink/binutil"

export const init = () =>
	compileBin()
		// .chain(() => runBunCommand0("x husky init"))
		// .chain(() => compileBin())
		.chain(() => initSrv())
		.orNothing()

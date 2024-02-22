// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { compileBin } from "./_compile-bin"
import { initSrv } from "./_init-srv"

export const init = () =>
	compileBin()
		.chain(() => initSrv())
		.orNothing()

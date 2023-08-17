// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { createSymlinks } from "./_create-symlinks"
import { compileBin } from "./_compile-bin"
import { initSrv } from "./_init-srv"
import { registerGitHooks } from "./_register-git-hooks"

export const init = () =>
	createSymlinks()
		.chain(() => compileBin())
		.chain(() => initSrv())
		.chain(() => registerGitHooks())
		.orNothing()

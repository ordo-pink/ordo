// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { FSID } from "@ordo-pink/data"

declare global {
	module cmd {
		module fileExplorer {
			type goToFileExplorer = { name: "file-explorer.go-to-file-explorer" }
			type showInFileExplorer = { name: "file-explorer.show-in-file-explorer"; payload: FSID }
		}
	}
}

export {}

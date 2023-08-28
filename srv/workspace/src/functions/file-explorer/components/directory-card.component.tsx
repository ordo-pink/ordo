// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Directory, DirectoryUtils } from "@ordo-pink/datautil"
import DirectoryIconComponent from "./directory-icon.component"

type P = { directory: Directory }
export default function DirectoryCardComponent({ directory }: P) {
	return (
		<div className="flex flex-col items-center">
			<DirectoryIconComponent />
			<div>{DirectoryUtils.getReadableName(directory.path)}</div>
		</div>
	)
}

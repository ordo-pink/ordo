// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { File, FileUtils } from "@ordo-pink/datautil"
import FileIconComponent from "./file-icon.component"

type P = { file: File }
export default function FileCardComponent({ file }: P) {
	return (
		<div className="flex flex-col items-center">
			<FileIconComponent file={file} />
			<div>{FileUtils.getReadableName(file.path)}</div>
		</div>
	)
}

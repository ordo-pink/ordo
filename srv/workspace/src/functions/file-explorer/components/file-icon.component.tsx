// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { File, FileUtils } from "@ordo-pink/datautil"
import { Switch } from "@ordo-pink/switch"
import { BsFileBinary } from "react-icons/bs"

// TODO: Take file associations
type P = { file: File }
export default function FileIconComponent({ file }: P) {
	// TODO: Add support for array predicate in Switch
	return Switch.of(FileUtils.getExtension(file.path)).default(() => (
		<BsFileBinary className="w-full h-full" />
	))
}

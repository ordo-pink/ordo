// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { AiFillFolder } from "react-icons/ai"
import { BsChevronRight } from "react-icons/bs"

type Props = {
	chunk: string
}

export const PathBreadcrumbsItem = ({ chunk }: Props) => {
	return (
		<div className="mb-2 mr-4 flex max-w-[5rem] shrink-0 items-center space-x-2 first-of-type:ml-0">
			<AiFillFolder className="shrink-0" />
			<div className="truncate">{chunk ? chunk : "/"}</div>
			<BsChevronRight className="shrink-0" />
		</div>
	)
}

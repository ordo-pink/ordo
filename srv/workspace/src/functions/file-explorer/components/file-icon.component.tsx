// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { PlainData } from "@ordo-pink/data"
import { Switch } from "@ordo-pink/switch"
import { BsFileEarmark, BsFolder2 } from "react-icons/bs"

type P = { plain: PlainData }
export default function FileIconComponent({ plain }: P) {
	return <BsFileEarmark className="w-full h-full" />
}

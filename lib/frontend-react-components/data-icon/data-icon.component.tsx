// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { BsFileEarmark, BsFolder2 } from "react-icons/bs"

import { useChildren, useStrictSubscription } from "@ordo-pink/frontend-react-hooks"
import { PlainData } from "@ordo-pink/data"
import { Switch } from "@ordo-pink/switch"
import { fileAssociations$ } from "@ordo-pink/frontend-stream-file-associations"

type P = { plain: PlainData }
export default function DataIcon({ plain }: P) {
	const children = useChildren(plain)
	const fileAssociations = useStrictSubscription(fileAssociations$, [])
	const Association = fileAssociations.find(
		fileAssociation => fileAssociation.contentType === plain.contentType,
	)!

	return Switch.OfTrue()
		.case(
			() => children.length > 0,
			() => <BsFolder2 className="size-full" />,
		)
		.case(!!Association, () => Association && Association.Icon && <Association.Icon />)
		.default(() => <BsFileEarmark className="size-full shrink-0" />)
}

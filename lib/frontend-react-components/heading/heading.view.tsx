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

import { Switch } from "@ordo-pink/switch"
import { THeadingViewProps } from "./heading.types"

export const HeadingView = ({ level, className, children }: THeadingViewProps) =>
	Switch.of(level)
		.case("1", () => <h1 className={className}>{children}</h1>)
		.case("2", () => <h2 className={className}>{children}</h2>)
		.case("3", () => <h3 className={className}>{children}</h3>)
		.case("4", () => <h4 className={className}>{children}</h4>)
		.case("5", () => <h5 className={className}>{children}</h5>)
		.default(() => <div>{children}</div>)

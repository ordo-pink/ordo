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

import { create_dir_if_not_exists0 } from "@ordo-pink/fs"
import { die } from "@ordo-pink/binutil"
import { getc } from "@ordo-pink/getc"
import { invokers0 } from "@ordo-pink/oath"

const { ORDO_STATIC_ROOT } = getc(["ORDO_STATIC_ROOT"])

void create_dir_if_not_exists0(ORDO_STATIC_ROOT).invoke(invokers0.or_else(die()))

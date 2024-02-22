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

import { WorkspaceSplitSize } from "./frontend-stream-sidebar.types"

export const NARROW_WINDOW_BREAKPOINT = 768
export const DEFAULT_WORKSPACE_SPLIT_SIZE = [25, 75] as WorkspaceSplitSize
export const DEFAULT_WORKSPACE_SPLIT_SIZE_NARROW_OPEN = [100, 0] as WorkspaceSplitSize
export const DEFAULT_WORKSPACE_SPLIT_SIZE_NO_SIDEBAR = [0, 100] as WorkspaceSplitSize

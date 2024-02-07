// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

export type WorkspaceSplitSize = [number, number]

export type SidebarState = { disabled: false; sizes: WorkspaceSplitSize } | { disabled: true }

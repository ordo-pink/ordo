// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

export type WorkspaceSplitSize = [number, number]

export type DisabledSidebar = { disabled: true }

export type EnabledSidebar = { disabled: false; sizes: WorkspaceSplitSize }

export type SidebarState = EnabledSidebar | DisabledSidebar

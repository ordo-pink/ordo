/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Node } from "@xyflow/react"

declare global {
	// interface cmd {
	// 	board: {
	// 		context_menu: {
	// 			add_existing_file: () => { x: number; y: number }
	// 			create_node: () => { x: number; y: number; from?: string }
	// 			show_create_file: () => Ordo.Metadata.FSID
	// 		}
	// 	}
	// }
}

export namespace Board {
	export namespace Nodes {
		export type Note = Node<{ content: string }>
		export type Embed = Node<{ fsid: Ordo.Metadata.FSID }>
	}
}

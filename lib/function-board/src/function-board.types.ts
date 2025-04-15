/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

declare global {
	interface t {
		board: {
			file_association: {
				readable_name: () => string
				description: () => string
			}
		}
	}

	interface cmd {
		board: {
			context_menu: {
				show_create_file: () => Ordo.Metadata.FSID
				create_node: () => { x: number; y: number; from?: string }
				add_existing_file: () => { x: number; y: number }
			}
		}
	}
}

export {}

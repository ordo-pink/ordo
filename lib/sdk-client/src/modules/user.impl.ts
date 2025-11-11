/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

declare global {
	interface cmd {
		user: {
			show_request_code_modal: { args: void }
			show_verify_code_modal: { args: void }
			sign_out: { args: void }
			go_to_account: { args: void }
		}
	}
}

export {}

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

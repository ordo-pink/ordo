declare global {
	interface t {
		fns: {
			landing: {
				title: string
				cookie_notification: {
					title: string
					message: string
				}
				buttons: {
					join: string
					learn_more: string
					try_now: string
				}
				cta: {
					announcement: string
				}
			}
		}
	}
}

export namespace FLanding {}

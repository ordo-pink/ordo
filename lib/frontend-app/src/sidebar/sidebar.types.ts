export namespace Sidebar {
	export type State = {
		enabled: boolean
		visible: boolean
	}
}

declare global {
	interface t {
		sidebar: {
			commands: {
				toggle: {
					title: string
					description: string
				}
				show: {
					title: string
					description: string
				}
				hide: {
					title: string
					description: string
				}
			}
		}
	}
}

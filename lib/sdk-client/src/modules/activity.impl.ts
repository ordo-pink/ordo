declare global {
	interface cmd {
		activity: {
			register: { args: OrdoClient.Activity.Instance }
			unregister: { args: OrdoClient.Activity.ID }
		}
	}

	export namespace OrdoClient.Activity {
		export type State = {
			items: Instance[]
			current: Instance | null
		}

		export type Route = `/${string}`

		export type OnUnmountArgs = {
			icon?: HTMLSpanElement
			sidebar?: HTMLDivElement
			workspace?: HTMLDivElement
		}

		export type OnUnmount = (args: OnUnmountArgs) => void

		export type RenderIcon = (span: HTMLSpanElement) => void | Promise<void>

		export type RenderSidebar = (div: HTMLDivElement) => void | Promise<void>

		export type RenderWorkspace = (div: HTMLDivElement) => void | Promise<void>

		export type ID = string

		export type Instance = {
			id: ID
			readable_name: OrdoClient.Translations.Key
			routes: Route[]
			start_route?: Route
			onunmount?: OnUnmount
			render_icon?: RenderIcon
			render_sidebar?: RenderSidebar
			render_workspace?: RenderWorkspace
		}
	}
}

export {}

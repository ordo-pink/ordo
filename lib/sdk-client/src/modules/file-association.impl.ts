declare global {
	namespace OrdoClient.FileAssociation {
		export type RenderFn = (params: RenderParams) => void | Promise<void>

		export type RenderToStringFn = (params: RenderParams) => string | Promise<string>

		export type RenderIconFn = (span: HTMLSpanElement) => void | Promise<void>

		export type Type = {
			description: OrdoClient.Translations.Key
			name: string
			readable_name: OrdoClient.Translations.Key
		}

		// TODO Support for marking files as remote-only
		export type Instance = {
			name: string
			render_icon?: RenderIconFn
			content_to_string?: {
				render?: RenderToStringFn
				styles?: string[]
			}
			render: RenderFn
			types: Type[]
		}

		export type RenderParams = {
			div: HTMLDivElement
			is_editable: boolean
			is_embedded: boolean
			// data: Data.Instance
		}
	}
}

export {}

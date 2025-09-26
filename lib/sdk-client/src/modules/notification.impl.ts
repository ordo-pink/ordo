export enum TYPE {
	DEFAULT,
	SUCCESS,
	INFO,
	WARN,
	QUESTION,
	RRR,
	length,
}

declare global {
	interface cmd {
		notification: {
			hide: { args: Ordo.Uuid.Instance }
			show: { args: OrdoClient.Notification.ShowArgs }
			rrr: { args: Ordo.Rrr.Instance & { message: OrdoClient.Translations.Key } }
		}
	}

	namespace OrdoClient.Notification {
		export type ShowArgs = Ordo.Prettify<Partial<Instance> & Required<Pick<Instance, "message">>>

		export type Instance = {
			id: Ordo.Uuid.Instance
			type?: TYPE
			title?: OrdoClient.Translations.Key
			message: OrdoClient.Translations.Key
			render_icon?: (div: HTMLDivElement) => void | Promise<void>
			duration?: number
			on_click?: () => void
			// persist?: boolean
			// payload?: T
			// action?: (id: string, payload: T) => void
			// action_text?: Client.Translations.Key
		}
	}
}

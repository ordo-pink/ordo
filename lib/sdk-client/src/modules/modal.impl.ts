export enum SIZE {
	SM,
	MD,
	LG,
	XL,
	XXL,
}

declare global {
	interface cmd {
		modal: {
			hide: { args: void }
			show: { args: OrdoClient.Modal.Params }
		}
	}

	namespace OrdoClient.Modal {
		type Params = { onunmount?: () => void; render: (div: HTMLDivElement) => void | Promise<void>; size?: SIZE }
	}
}

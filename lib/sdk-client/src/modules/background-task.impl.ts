export enum STATUS {
	NONE,
	SAVING,
	LOADING,
	length,
}

declare global {
	interface cmd {
		background_status: {
			saving: { args: void }
			loading: { args: void }
			none: { args: void }
		}
	}
}

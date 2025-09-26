declare global {
	interface cmd {
		sidebar: {
			enable: { args: void }
			disable: { args: void }
			show: { args: void }
			hide: { args: void }
			toggle: { args: void }
		}
	}
}

export {}

export type SidebarState = {
	show: boolean
	width: number
	component: string
}

export type SidebarWindow = {
	get: () => Promise<SidebarState>
	toggle: () => Promise<void>
}

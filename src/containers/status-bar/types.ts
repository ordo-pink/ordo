import { IconType } from "react-icons"

export enum StatusBarOnClickAction {
	OPEN_COMMANDER,
	OPEN_PANEL,
}

export type StatusBarComponent = {
	show: boolean
	icon?: IconType | string
	text: string
	onClick: (x: unknown) => void | Promise<void>
}

export type StatusBarOptions = {
	show: boolean
	components: StatusBarComponent
}

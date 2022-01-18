import * as HiIcons from "react-icons/hi"
import { IconType } from "react-icons/lib"

export type SupportedIcon = keyof typeof HiIcons

export const getSupportedIcon = (name: keyof typeof HiIcons): IconType =>
	(HiIcons as Record<keyof typeof HiIcons, IconType>)[name]

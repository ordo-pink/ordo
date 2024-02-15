import type { PropsWithChildren } from "react"

export type THeadingLevel = "1" | "2" | "3" | "4" | "5"

export type THeadingProps = PropsWithChildren<{
	level?: THeadingLevel
	uppercase?: boolean
	center?: boolean
	trim?: boolean
	styledFirstLetter?: boolean
}>

export type THeadingViewProps = PropsWithChildren<{
	level: THeadingLevel
	className: string
}>

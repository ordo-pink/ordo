import { Range } from "@ordo-pink/tau"

export type Percentage = Range<0, 101>

export type Progress = `${number} / ${number}`

export type TUsedSpaceModel = [number, number]

export type TUsedSpaceViewProps = {
	progress: Progress
	percentage: Percentage
}

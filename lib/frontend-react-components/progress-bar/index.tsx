import { get_percentage } from "@ordo-pink/tau"

type P = { total: number; current: number; text?: string }
export default function ProgressBar({ total, current, text }: P) {
	const progressPercentage = get_percentage(total, current)
	const progressBarStyle = { width: `${progressPercentage}%` }
	const progress = `${current} / ${total}`

	return (
		<div className="w-full">
			<div className="flex w-full items-center justify-between">
				<div className="truncate text-xs">{text}</div>
				<div className="text-xs">{progress}</div>
			</div>
			<div className="w-full rounded-sm bg-neutral-300 shadow-inner dark:bg-neutral-700">
				<div
					className="h-4 rounded-sm bg-gradient-to-r from-pink-500 to-purple-500"
					style={progressBarStyle}
				/>
			</div>
		</div>
	)
}

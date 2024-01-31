import { TUsedSpaceViewProps } from "./used-space.types"

export const View = ({ progress, progressPercentage }: TUsedSpaceViewProps) => {
	const progressBarStyle = { width: progressPercentage }

	const tFileLimit = "Лимит файлов"

	return (
		<div className="w-full max-w-sm">
			<div className="flex justify-between items-center w-full">
				<div className="text-xs truncate">{tFileLimit}</div>
				<div className="text-xs">{progress}</div>
			</div>
			<div className="w-full rounded-full shadow-inner bg-neutral-300 dark:bg-neutral-700">
				<div
					className="h-1 bg-gradient-to-r rounded-full from-slate-500 to-neutral-500"
					style={progressBarStyle}
				/>
			</div>
		</div>
	)
}

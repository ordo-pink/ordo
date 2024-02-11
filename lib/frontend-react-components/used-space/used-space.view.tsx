import { TUsedSpaceViewProps } from "./used-space.types"

export const UsedSpaceView = ({
	progress,
	percentage: progressPercentage,
}: TUsedSpaceViewProps) => {
	const progressBarStyle = { width: `${progressPercentage}%` }

	// --- Translations ---
	const tFileLimit = "Лимит файлов"

	return (
		<div className="w-full max-w-md">
			<div className="flex w-full items-center justify-between">
				<div className="truncate text-xs">{tFileLimit}</div>
				<div className="text-xs">{progress}</div>
			</div>
			<div className="w-full rounded-full bg-neutral-300 shadow-inner dark:bg-neutral-700">
				<div
					className="h-1 rounded-full bg-gradient-to-r from-slate-500 to-neutral-500"
					style={progressBarStyle}
				/>
			</div>
		</div>
	)
}

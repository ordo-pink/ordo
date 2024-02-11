type P = { achievement: Achievements.AchievementDAO }
export default function Achievement({ achievement }: P) {
	const isCompleted = !!achievement.completedAt

	return (
		<div className="flex flex-col items-center space-y-2 rounded-lg bg-gradient-to-br from-neutral-300 to-neutral-300 p-2 sm:flex-row sm:space-x-2 sm:space-y-0 dark:from-neutral-800 dark:via-neutral-800 dark:to-stone-800">
			<div
				className={`w-full shrink-0 rounded-md shadow-md sm:w-1/6 md:w-1/12 ${!isCompleted && "grayscale"}`}
			>
				<img
					className="min-h-24 min-w-24 rounded-md"
					src={achievement.icon}
					alt={achievement.title}
					title={achievement.title}
				/>
			</div>
			<div className="flex w-full grow flex-col justify-center space-y-1 sm:w-4/6 md:w-10/12">
				<div className="w-full text-center text-base font-bold sm:text-lg">{achievement.title}</div>
				<div className="w-full text-center text-sm sm:text-base">{achievement.description}</div>
			</div>

			<div className="flex size-full flex-col items-center justify-end pr-2 text-xs text-neutral-500 sm:w-1/6 sm:items-end md:w-1/12">
				{achievement.completedAt
					? new Date(achievement.completedAt).toLocaleDateString()
					: "Не получено"}
			</div>
		</div>
	)
}

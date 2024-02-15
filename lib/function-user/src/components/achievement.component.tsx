type P = { achievement: Achievements.AchievementDAO }
export default function Achievement({ achievement }: P) {
	const isCompleted = !!achievement.completedAt

	return (
		<div className="flex flex-col items-center p-2 space-y-2 bg-gradient-to-br rounded-lg from-neutral-300 to-neutral-300 sm:flex-row sm:space-x-2 sm:space-y-0 dark:from-neutral-800 dark:via-neutral-800 dark:to-stone-800">
			<div className={`shrink-0 rounded-md shadow-md ${!isCompleted && "grayscale"}`}>
				<img
					className="rounded-md size-24"
					src={achievement.image}
					alt={achievement.title}
					title={achievement.title}
				/>
			</div>
			<div className="flex flex-col justify-center space-y-1 w-full grow">
				<div className="w-full text-base font-bold text-center sm:text-lg">{achievement.title}</div>
				<div className="w-full text-sm text-center sm:text-base">{achievement.description}</div>
			</div>

			<div className="flex flex-col justify-end items-center pr-2 h-full text-xs text-neutral-500 sm:items-end">
				{achievement.completedAt ? new Date(achievement.completedAt).toLocaleDateString() : ""}
			</div>
		</div>
	)
}

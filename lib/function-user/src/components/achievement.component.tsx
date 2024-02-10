type P = { achievement: Achievements.AchievementDAO }
export default function Achievement({ achievement }: P) {
	const isCompleted = !!achievement.completedAt

	return (
		<div className="flex flex-col items-center space-y-2 rounded-lg bg-gradient-to-br from-neutral-300 to-neutral-300 p-2 sm:flex-row sm:space-x-2 sm:space-y-0 dark:from-neutral-800 dark:via-neutral-800 dark:to-stone-800">
			<div className={`size-20 h-max shrink-0 rounded-md shadow-md ${!isCompleted && "grayscale"}`}>
				<img
					className="rounded-md"
					src={achievement.icon}
					alt={achievement.title}
					title={achievement.title}
				/>
			</div>
			<div className="flex grow flex-col justify-center space-y-1">
				<div className="w-full text-center text-base font-bold sm:text-lg">{achievement.title}</div>
				<div className="w-full text-center text-sm sm:text-base">{achievement.description}</div>
			</div>

			<div className="flex h-full flex-col justify-end pr-2">
				{achievement.completedAt && achievement.completedAt.toLocaleDateString()}
			</div>
		</div>
	)
}

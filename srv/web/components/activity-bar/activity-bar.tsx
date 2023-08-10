import { useUser } from "../../streams/auth.ts"
import type * as T from "../../types.ts"
import Null from "../null.tsx"
import Activity from "./activity.tsx"

type Props = {
	activities: T.Activity[]
}

export default function ActivityBar({ activities }: Props) {
	const user = useUser()

	return (
		<div class="h-screen w-20 flex flex-col justify-between items-center p-2 text-lg sm:text-2xl z-50 bg-neutral-200 dark:bg-neutral-900">
			<div class="flex flex-col space-y-4 items-center">
				{activities.map(activity =>
					activity.background ? null : (
						<Activity key={activity.name} name={activity.name} version={activity.version} />
					)
				)}
			</div>
			<div>{user.fold(Null, user => user.email.slice(0, 1))}</div>
		</div>
	)
}

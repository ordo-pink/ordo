import type * as T from "../../types.ts"
import Activity from "./activity.tsx"

type Props = {
	activities: T.Activity[]
}

export default function ActivityBar({ activities }: Props) {
	return (
		<div>
			{activities.map(activity =>
				activity.background ? null : (
					<Activity
						key={activity.name}
						name={activity.name}
						version={activity.version}
					/>
				)
			)}
		</div>
	)
}

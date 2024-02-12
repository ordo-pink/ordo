import { useHosts, useUser, useUserName } from "@ordo-pink/frontend-react-hooks"
import { Either } from "@ordo-pink/either"

import Heading from "@ordo-pink/frontend-react-components/heading"
import Null from "@ordo-pink/frontend-react-components/null"
import UsedSpace from "@ordo-pink/frontend-react-components/used-space"

export default function FileExplorerCardComponent() {
	const user = useUser()
	const name = useUserName()!
	const hosts = useHosts()

	return Either.fromNullable(user).fold(Null, user => (
		<div className="flex size-full flex-col items-center justify-center">
			<div className="flex w-full max-w-lg flex-col items-center space-y-4">
				<div className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-sky-400 via-purple-400 to-rose-400 p-0.5 shadow-lg">
					<img
						src={`${hosts.staticHost}/logo.png`}
						alt="avatar"
						className="h-16 rounded-full bg-white md:h-20 dark:from-stone-900 dark:via-zinc-900 dark:to-neutral-900"
					/>
				</div>
				<div className="flex w-full max-w-md flex-col space-y-1 md:space-y-2">
					<Heading level="2" trim styledFirstLetter>
						{name.fullName || user.email}
					</Heading>
					<UsedSpace />
				</div>
			</div>
		</div>
	))
}

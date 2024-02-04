// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import Null from "$components/null"
import { Title } from "$components/page-header"
import UsedSpace from "$components/used-space"
import { Hosts } from "$utils/hosts"
import { UserUtils } from "$utils/user-utils.util"
import { Either } from "@ordo-pink/either"
import { useSharedContext } from "@ordo-pink/core"

export default function FileExplorerCardComponent() {
	const { user } = useSharedContext()

	return Either.fromNullable(user).fold(Null, user => (
		<div className="flex flex-col justify-center items-center w-full h-full">
			<div className="flex items-center space-x-4 w-full max-w-lg">
				<div className="flex items-center justify-center rounded-full p-0.5 bg-gradient-to-tr from-sky-400 via-purple-400 to-rose-400 shadow-lg shrink-0">
					<img
						src={`${Hosts.STATIC}/logo.png`}
						alt="avatar"
						className="h-16 bg-white rounded-full md:h-20 dark:from-stone-900 dark:via-zinc-900 dark:to-neutral-900"
						// onClick={() =>
						// 	showModal(() => <UploadAvatarModal onAvatarChanged={handleAvatarChanged} />)
						// }
					/>
				</div>
				<div className="flex flex-col space-y-1 w-full max-w-md md:space-y-2">
					<Title level="2" trim styledFirstLetter>
						{UserUtils.getUserName(user)}
					</Title>
					<UsedSpace />
				</div>
			</div>
		</div>
	))
}

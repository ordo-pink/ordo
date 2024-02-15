import { Suspense } from "react"

import { Either } from "@ordo-pink/either"

import Loading from "@ordo-pink/frontend-react-components/loading-page"

import { type WorkspaceContentProps } from "./workspace.types"

export default function WorkspaceWithoutSidebar({ activity }: WorkspaceContentProps) {
	return Either.fromNullable(activity).fold(
		() => (
			<div className="min-h-screen w-screen">
				<Loading />
			</div>
		),
		({ Component }) => (
			<div className="workspace size-full min-h-screen overflow-auto pl-12">
				<Suspense>
					<Component />
				</Suspense>
			</div>
		),
	)
}

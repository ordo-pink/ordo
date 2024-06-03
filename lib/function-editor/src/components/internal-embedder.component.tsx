import { BsFileEarmark } from "react-icons/bs"
import { RenderElementProps } from "slate-react"

import { chainE, fromNullableE, mapE } from "@ordo-pink/either"
import { useContent, useDataByFSID, useStrictSubscription } from "@ordo-pink/frontend-react-hooks"
import { fileAssociations$ } from "@ordo-pink/frontend-stream-file-associations"

export default function InternalEmbedder({ children, element }: RenderElementProps) {
	const data = useDataByFSID((element as any).fsid)
	// TODO: Extract to a hook
	const fileAssociations = useStrictSubscription(fileAssociations$, [])
	const content = useContent((element as any).fsid)

	const Assoc = fileAssociations.find(association => association.contentType === data?.contentType)

	return fromNullableE(data)
		.pipe(chainE(data => fromNullableE(Assoc).pipe(mapE(({ Component }) => ({ data, Component })))))
		.fold(
			// TODO: Handle unable to
			renderChildren(children),
			({ Component, data }) => (
				<div
					contentEditable={false}
					className="rounded-lg bg-neutral-300 shadow-md dark:bg-neutral-800 "
				>
					<div className="flex flex-wrap items-center space-x-2 rounded-t-lg bg-gradient-to-r from-neutral-200 via-neutral-200 to-sky-200 px-2 py-1 dark:from-neutral-700 dark:via-neutral-700 dark:!to-sky-950">
						<div>{Assoc && Assoc.Icon ? <Assoc.Icon /> : <BsFileEarmark />}</div>
						<div>{data.name}</div>
						<div>{children}</div>
					</div>

					<Component data={data} editable={false} content={content} isLoading={content === null} />
				</div>
			),
		)
}

// --- Internal ---

// TODO: Extract
function renderChildren({ children }: PropsWithChildren) {
	return function RenderProvidedChildren() {
		return <>{children}</>
	}
}

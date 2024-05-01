import { BsLink45Deg } from "react-icons/bs"
import { RenderElementProps } from "slate-react"

import { DataLabelInline } from "@ordo-pink/frontend-react-components/data-label"
import { useDataByFSID } from "@ordo-pink/frontend-react-hooks"

export default function Link({ children, element }: RenderElementProps) {
	const item = useDataByFSID((element as any).fsid)

	return (
		<span contentEditable={false} className="cursor-pointer pr-1">
			<DataLabelInline>
				<span className="flex items-center space-x-1">
					<BsLink45Deg />
					<span>{item?.name}</span>
					<span>{children}</span>
				</span>
			</DataLabelInline>
		</span>
	)
}

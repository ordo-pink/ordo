import { BsTag } from "react-icons/bs"
import { RenderElementProps } from "slate-react"

import { DataLabelInline } from "@ordo-pink/frontend-react-components/data-label"

export default function Label({ children, element }: RenderElementProps) {
	return (
		<span contentEditable={false} className="cursor-pointer pr-1">
			<DataLabelInline>
				<span className="flex items-center space-x-1">
					<BsTag />
					<span>#{(element as any).label}</span>
					<span>{children}</span>
				</span>
			</DataLabelInline>
		</span>
	)
}

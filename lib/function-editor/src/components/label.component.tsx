import { RenderElementProps } from "slate-react"

import { DataLabelInline } from "@ordo-pink/frontend-react-components/data-label"

export default function Label({ children, element }: RenderElementProps) {
	return (
		<span contentEditable={false} className="cursor-pointer pr-1">
			<DataLabelInline>
				#{(element as any).label}
				{children}
			</DataLabelInline>
		</span>
	)
}

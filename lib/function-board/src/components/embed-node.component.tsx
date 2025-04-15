import { Handle, Node, NodeProps, NodeResizeControl, Position } from "@xyflow/react"
import { useEffect, useRef } from "react"

import { Maoka } from "@ordo-pink/maoka"
import { MaokaDOM } from "@ordo-pink/maoka-render-dom"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { RenderPicker } from "@ordo-pink/frontend-app/src/sections/file-editor/components/file-editor-workspace-render-picker.component"

const EmbedNode =
	(ctx: Ordo.CreateFunction.State) =>
	({ id, selected, height }: NodeProps<Node<{ fsid: Ordo.Metadata.FSID }>>) => {
		const ref = useRef<HTMLDivElement>(null)

		useEffect(() => {
			if (!ref.current) return

			const metadata = ctx.metadata_query.get_by_fsid(id as Ordo.Metadata.FSID).cata({ Ok: x => x, Err: () => null })

			if (metadata) {
				const Component = MaokaOrdo.Components.WithState(ctx, () =>
					Maoka.create("div", () => () => [RenderPicker(metadata, selected, true)]),
				)

				MaokaDOM.render(ref.current, Component, () => crypto.randomUUID()).catch(console.error)
			}
		}, [])

		return (
			<div style={{ height: `${height! - 25}px` }} className="overflow-auto">
				<Handle position={Position.Top} type="source" id="ts" />
				<Handle position={Position.Top} type="target" id="tt" />
				<Handle position={Position.Left} type="source" id="ls" />
				<Handle position={Position.Left} type="target" id="lt" />
				<Handle position={Position.Right} type="source" id="rs" />
				<Handle position={Position.Right} type="target" id="rt" />
				<Handle position={Position.Bottom} type="source" id="bs" />
				<Handle position={Position.Bottom} type="target" id="bt" />
				<NodeResizeControl />

				<div className="overflow-y-visible" ref={ref} />
			</div>
		)
	}

export default (ctx: Ordo.CreateFunction.State) => EmbedNode(ctx)

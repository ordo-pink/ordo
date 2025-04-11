import {
	Background,
	Connection,
	Edge,
	Node,
	ReactFlow,
	ReactFlowProvider,
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	useEdgesState,
	useNodesState,
} from "@xyflow/react"
import { useCallback, useEffect } from "react"

import { BsFileEarmarkPlus, BsPlus } from "@ordo-pink/frontend-icons"
import { ContextMenuItemType } from "@ordo-pink/core"
import { is_object } from "@ordo-pink/tau"

import "@xyflow/react/dist/style.css"
import "./board.css"

type P = Ordo.FileAssociation.RenderParams & {
	commands: Ordo.Command.Commands
}
export default function Board({ metadata, content, commands }: P) {
	const [nodes, set_nodes] = useNodesState([] as Node[])
	const [edges, set_edges] = useEdgesState([] as Edge[])

	useEffect(() => {
		if (content) {
			try {
				const str = new TextDecoder().decode(content as unknown as ArrayBuffer)
				const { nodes, edges } = JSON.parse(str)
				set_nodes(nodes)
				set_edges(edges)
			} catch (e) {
				console.log(e)
			}
		}

		commands.on("cmd.board.context_menu.create_node", ({ x, y }) => {
			set_nodes(nodes => [...nodes, { id: crypto.randomUUID(), position: { x, y }, data: { label: "" }, connectable: true }])
		})

		commands.emit("cmd.application.context_menu.add", {
			command: "cmd.board.context_menu.show_create_file",
			readable_name: "t.common.components.modals.create_file.title",
			should_show: ({ payload }) => is_object(payload) && payload.location === "pink.ordo.board" && payload.element === "board",
			payload_creator: () => metadata.get_fsid(),
			type: ContextMenuItemType.CREATE,
			render_icon: BsFileEarmarkPlus,
		})

		commands.emit("cmd.application.context_menu.add", {
			command: "cmd.board.context_menu.create_node",
			readable_name: "Create note" as any, // TODO i18n
			should_show: ({ payload }) => is_object(payload) && payload.location === "pink.ordo.board" && payload.element === "board",
			payload_creator: ({ event }) => ({ x: event.x, y: event.y }),
			type: ContextMenuItemType.CREATE,
			render_icon: BsPlus,
		})

		return () => {
			commands.emit("cmd.application.context_menu.remove", "cmd.board.context_menu.show_create_file")
		}
	}, [])

	const on_connect = useCallback((connection: Connection) => set_edges(edges => addEdge(connection, edges)), [set_edges])

	return (
		<div className="h-full">
			<div style={{ width: "100%", height: "100%", background: "rgba(0,0,0,0)" }}>
				<ReactFlowProvider>
					<ReactFlow
						nodes={nodes}
						edges={edges}
						onConnect={on_connect}
						onNodesChange={changes => {
							const updated = applyNodeChanges(changes, nodes)

							commands.emit("cmd.content.set", {
								fsid: metadata.get_fsid(),
								content: new TextEncoder().encode(JSON.stringify({ nodes: updated, edges })).buffer,
								content_type: "board/ordo",
							})

							set_nodes(updated)
						}}
						onEdgesChange={changes => {
							const updated = applyEdgeChanges(changes, edges)

							console.log(updated)

							set_edges(updated)
						}}
						colorMode="dark" // TODO Switch between light and dark
						onContextMenu={event => {
							event.preventDefault()

							commands.emit("cmd.application.context_menu.show", {
								event: event.nativeEvent,
								payload: { location: "pink.ordo.board", element: "board" },
							})
						}}
						snapToGrid
						fitView
					>
						<Background />
					</ReactFlow>
				</ReactFlowProvider>
			</div>
		</div>
	)
}

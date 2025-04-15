import {
	Background,
	Connection,
	Edge,
	Node,
	NodeTypes,
	ReactFlow,
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	useEdgesState,
	useNodesState,
	useReactFlow,
} from "@xyflow/react"
import { memo, useCallback, useEffect, useState } from "react"

import "@xyflow/react/dist/base.css"

import { BsFileEarmarkPlus } from "@ordo-pink/frontend-icons"
import { ContextMenuItemType } from "@ordo-pink/core"
import { is_object } from "@ordo-pink/tau"
import { oath } from "@ordo-pink/oath"

import EmbedNode from "./embed-node.component"

import "./board.css"
import { R } from "@ordo-pink/result"

type P = Ordo.FileAssociation.RenderParams & {
	ctx: Ordo.CreateFunction.State
}
export default function Board({ content, ctx, metadata }: P) {
	const [nodes, set_nodes] = useNodesState([] as Node[])
	const [edges, set_edges] = useEdgesState([] as Edge[])
	const [node_types, set_node_types] = useState({} as NodeTypes)

	const { screenToFlowPosition } = useReactFlow()

	useEffect(() => {
		if (content) {
			try {
				const str = new TextDecoder().decode(content as unknown as ArrayBuffer) // TODO Always ArrayBuffer
				const { nodes, edges } = JSON.parse(str)

				set_nodes(nodes)
				set_edges(edges)
			} catch (e) {
				ctx.logger.error(e)
			}
		}

		set_node_types({ embed: memo(EmbedNode(ctx)) })

		ctx.commands.emit("cmd.application.context_menu.add", {
			command: "cmd.board.context_menu.create_node",
			readable_name: "Create Text Note" as any, // TODO i18n
			should_show: ({ payload }) => is_object(payload) && payload.location === "pink.ordo.board" && payload.element === "board",
			type: ContextMenuItemType.CREATE,
			render_icon: BsFileEarmarkPlus,
			payload_creator: ({ event }) => screenToFlowPosition({ x: event.clientX, y: event.clientY }),
		})

		ctx.commands.emit("cmd.application.context_menu.add", {
			command: "cmd.board.context_menu.add_existing_file",
			readable_name: "Add Existing File..." as any, // TODO i18n
			should_show: ({ payload }) => is_object(payload) && payload.location === "pink.ordo.board" && payload.element === "board",
			type: ContextMenuItemType.CREATE,
			render_icon: BsFileEarmarkPlus,
			payload_creator: ({ event }) => screenToFlowPosition({ x: event.clientX, y: event.clientY }),
		})

		const handle_add_existing_file: Ordo.Command.HandlerOf<"cmd.board.context_menu.add_existing_file"> = ({ x, y }) => {
			const files = ctx.metadata_query.get().cata({ Ok: x => x, Err: () => [] as Ordo.Metadata.Instance[] })

			ctx.commands.emit("cmd.application.command_palette.show", {
				items: files.map(file => ({
					readable_name: file.get_name() as Ordo.I18N.TranslationKey,
					value: file.get_fsid(),
				})),
				on_select: item => {
					set_nodes(nodes => [
						...nodes,
						{
							type: "embed",
							id: item.value,
							position: { x, y },
							height: 100,
							width: 200,
							data: {},
							connectable: true,
							resizing: true,
						},
					])
				},
			})
		}

		const handle_create_node: Ordo.Command.HandlerOf<"cmd.board.context_menu.create_node"> = ({ x, y }) => {
			const parent = metadata.get_fsid()
			const random_name = `.${crypto.randomUUID().replace("-", "")}`

			ctx.commands
				.naga("cmd.metadata.create", { name: random_name, parent })
				.pipe(oath.ops.tap(console.log))
				.pipe(
					oath.ops.chain(() =>
						ctx.metadata_query
							.get_by_name(random_name, parent, { show_hidden: true })
							.cata({ Ok: oath.resolve, Err: oath.reject }),
					),
				)
				.pipe(oath.ops.chain(oath.from_nullable))
				.pipe(
					oath.ops.map(metadata => {
						const fsid = metadata.get_fsid()

						set_nodes(nodes => [
							...nodes,
							{
								type: "embed",
								id: fsid,
								position: { x, y },
								height: 100,
								width: 200,
								data: {},
								connectable: true,
								resizing: true,
							},
						])
					}),
				)
				.cata(oath.catas.or_else(ctx.logger.error))
		}

		ctx.commands.on("cmd.board.context_menu.create_node", handle_create_node)
		ctx.commands.on("cmd.board.context_menu.add_existing_file", handle_add_existing_file)

		return () => {
			ctx.commands.off("cmd.board.context_menu.add_existing_file", handle_add_existing_file)
			ctx.commands.off("cmd.board.context_menu.create_node", handle_create_node)
		}
	}, [])

	const on_connect = useCallback((connection: Connection) => set_edges(edges => addEdge(connection, edges)), [set_edges])

	return (
		<div className="h-full">
			<div style={{ width: "100%", height: "100%", background: "rgba(0,0,0,0)" }}>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					onConnect={on_connect}
					onNodesDelete={nodes =>
						nodes.forEach(node => {
							const item = ctx.metadata_query
								.get_by_fsid(node.id as Ordo.Metadata.FSID, { show_hidden: true })
								.cata(R.catas.or_else(() => null))

							if (item && item.get_parent() === metadata.get_fsid()) {
								ctx.commands.emit("cmd.metadata.remove", node.id as Ordo.Metadata.FSID)
							}
						})
					}
					nodeTypes={node_types}
					onNodesChange={changes => {
						const updated_nodes = applyNodeChanges(changes, nodes)

						ctx.commands.emit("cmd.content.set", {
							fsid: metadata.get_fsid(),
							content: new TextEncoder().encode(JSON.stringify({ nodes: updated_nodes, edges })).buffer,
							content_type: "board/ordo",
						})

						set_nodes(updated_nodes)
					}}
					onNodeContextMenu={(event, node) => {
						event.preventDefault()
						event.stopPropagation()

						const metadata = ctx.metadata_query
							.get_by_fsid(node.id as Ordo.Metadata.FSID, { show_hidden: true })
							.cata({ Ok: x => x, Err: () => null })

						if (metadata) {
							ctx.commands.emit("cmd.application.context_menu.show", {
								event: event.nativeEvent,
								payload: metadata,
							})
						}
					}}
					onEdgesChange={changes => {
						const updated_edges = applyEdgeChanges(changes, edges)

						ctx.commands.emit("cmd.content.set", {
							fsid: metadata.get_fsid(),
							content: new TextEncoder().encode(JSON.stringify({ edges: updated_edges, nodes })).buffer,
							content_type: "board/ordo",
						})

						set_edges(updated_edges)
					}}
					colorMode="dark" // TODO Switch between light and dark
					onContextMenu={event => {
						event.preventDefault()

						ctx.commands.emit("cmd.application.context_menu.show", {
							event: event.nativeEvent,
							payload: { location: "pink.ordo.board", element: "board" },
						})
					}}
					snapToGrid
					fitView
				>
					<Background />
				</ReactFlow>
			</div>
		</div>
	)
}

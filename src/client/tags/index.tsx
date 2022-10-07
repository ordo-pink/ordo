import { enableSideBar } from "@client/app/store"
import { useAppDispatch, useAppSelector } from "@client/state"
import { Nullable } from "@core/types"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { Network, Options, Edge, Node } from "vis-network"
import { getTags } from "./store"

export default function Tags() {
  const dispatch = useAppDispatch()
  const tree = useAppSelector((state) => state.app.personalDirectory)
  const hoveredTag = useAppSelector((state) => state.tags.hoveredTag)
  const selectedTags = useAppSelector((state) => state.tags.selectedTags)
  const tags = useAppSelector((state) => state.tags.tags)
  const ref = useRef<HTMLDivElement>(null)
  const [network, setNetwork] = useState<Nullable<Network>>(null)
  const [data, setData] = useState<{ nodes: Node[]; edges: Edge[] }>({ nodes: [], edges: [] })

  useEffect(() => void dispatch(enableSideBar()), [])

  useEffect(() => {
    if (tree) dispatch(getTags(tree))
  }, [tree])

  const mode =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"

  const allData = useMemo(
    () =>
      tags.reduce(
        (acc, tag) => {
          const tagNode = acc.nodes.find((node) => node.id === tag.name)

          if (!tagNode) {
            acc.nodes.push({
              id: tag.name,
              label: tag.name,
              size: 10 + 2 * tag.files.length,
              borderWidth: 0,
              color: mode === "dark" ? "#ec4899" : "#f472b6",
            })
          }

          for (const file of tag.files) {
            const fileNode = acc.nodes.find((node) => node.id === file)

            if (!fileNode) {
              acc.nodes.push({
                id: file,
                size: 10,
                shape: "hexagon",
                label: file.slice(0, -4),
                color: mode === "dark" ? "#fafaf9" : "#44403c",
                borderWidth: 0,
              })
            }

            acc.edges.push({
              from: file,
              to: tag.name,
              length: 150,
            })
          }

          return acc
        },
        { nodes: [] as Node[], edges: [] as Edge[] }
      ),
    [tags, ref.current]
  )

  useEffect(() => {
    if (!ref.current || !tags) return

    const options: Options = {
      manipulation: { enabled: false },
      nodes: { shape: "dot", font: { color: mode === "dark" ? "#ddd" : "#111" } },
      edges: { smooth: { enabled: true, type: "continuous", roundness: 0 } },
      interaction: { hover: true, hideEdgesOnDrag: true, tooltipDelay: 200 },
      physics: {
        enabled: true,
        solver: "repulsion",
        repulsion: {
          nodeDistance: 200, // Put more distance between the nodes.
        },
      },
    }

    const network = new Network(ref.current, data, options)
    network.disableEditMode()
    setNetwork(network)
  }, [ref, tags, data])

  useEffect(() => {
    if (!network || !data.nodes.some((node) => node.id === hoveredTag)) return

    hoveredTag ? network.selectNodes([hoveredTag]) : network.selectNodes([])
  }, [network, hoveredTag])

  useEffect(() => {
    if (!selectedTags.length) {
      setData(allData)
      return
    }

    const tagNodes = allData.nodes.filter((node) => selectedTags.some((tag) => node.id === tag))
    const edges = allData.edges.filter((edge) => tagNodes.some((node) => edge.to === node.id))
    const fileNodes = allData.nodes.filter((node) => edges.some((edge) => edge.from === node.id))

    const nodes = [...tagNodes, ...fileNodes]

    setData({ edges, nodes })
  }, [selectedTags, allData])

  return <div className="cursor-auto h-full w-full" ref={ref}></div>
}

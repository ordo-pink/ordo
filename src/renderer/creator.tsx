import React from "react"
import { useAppDispatch, useAppSelector } from "./app/hooks"
import { createFileOrFolder, setCurrentPath } from "./features/file-tree/file-tree-slice"
import { setCreateIn, toggleCreator } from "./features/ui/ui-slice"

export const Creator: React.FC = () => {
	const dispatch = useAppDispatch()

	const tree = useAppSelector((state) => state.fileTree.tree)
	const { createIn, showCreator } = useAppSelector((state) => state.ui)

	if (!createIn && tree) {
		dispatch(setCreateIn(tree))
	}

	const ref = React.useRef()
	const [creationName, setCreationName] = React.useState("")

	const resetState = () => {
		setCreationName("")
		dispatch(toggleCreator())
	}

	return (
		showCreator &&
		createIn && (
			<div
				className="fixed top-0 bottom-0 left-0 right-0 bg-gray-900 bg-opacity-40"
				onClick={resetState}
			>
				<div
					ref={ref}
					style={{
						top: "20%",
						left: "50%",
						transform: "translate(-50%, 0)",
						width: "70%",
						minWidth: "400px",
					}}
					className="fixed rounded-lg shadow-xl p-4 bg-gray-50"
					onClick={(e) => e.stopPropagation()}
				>
					<label className="p-1 flex flex-col space-y-2">
						<span>{createIn.path}/</span>
						<input
							placeholder="Type here..."
							autoFocus={showCreator}
							className="w-full outline-none bg-gray-50"
							type="text"
							onChange={(e) => setCreationName(e.target.value)}
							value={creationName}
							onKeyDown={(e) => {
								if (e.key === "Escape") {
									e.preventDefault()

									resetState()
								}

								if (e.key === "Enter") {
									e.preventDefault()

									dispatch(createFileOrFolder({ node: createIn, name: creationName }))

									if (!creationName.endsWith("/")) {
										dispatch(setCurrentPath(`${createIn.path}/${creationName}`))
									}

									resetState()
								}
							}}
						/>
					</label>

					<div className="text-xs text-gray-600 text-center mt-2">
						Press <kbd className="bg-pink-300 p-1 rounded-md">Enter</kbd> to apply changes or{" "}
						<kbd className="bg-pink-300 p-1 rounded-md">Esc</kbd> to drop.
					</div>

					<div className="text-xs text-gray-600 text-center mt-2">
						Ending with a <kbd className="bg-pink-300 p-1 rounded-md">/</kbd> will create a folder.
						Add file extension to your liking, e.g.{" "}
						<kbd className="bg-pink-300 p-1 rounded-md">.md</kbd> to create a Markdown file.
					</div>
				</div>
			</div>
		)
	)
}

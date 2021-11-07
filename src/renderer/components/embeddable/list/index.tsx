import React from "react"
import { Folder } from "../../../../main/apis/fs/types"
import { Conditional } from "../../conditional"

const ListView: React.FC<{ tree: Folder; subfolders: "ignore" | "nest" | "list" }> = ({
	tree,
	subfolders,
}) => (
	<div
		className={`w-full bg-${tree.color}-100 dark:bg-${tree.color}-300 rounded-lg shadow-lg p-4 my-4 flex flex-col space-y-2`}
	>
		<div className={`text-center text-xs text-${tree.color}-900`}>{tree.readableName}</div>
		{tree.children &&
			tree.children.map((item) => (
				<div key={item.path}>
					{item.isFile ? (
						<div className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-lg p-4">
							{item.readableName}
						</div>
					) : subfolders === "nest" && item.isFolder ? (
						<ListView tree={item} subfolders={subfolders} />
					) : (
						<></>
					)}
				</div>
			))}
	</div>
)

export const List: React.FC<{
	folder: string
	// actionProperty: string
	// bottomLeft: string
	// bottomRight: string
	// topLeft: string
	// topRight: string
	columns?: string
	subfolders?: "ignore" | "nest" | "list"
}> = ({ folder, columns = "", subfolders = "ignore" }) => {
	const [tree, setTree] = React.useState<Folder>({} as Folder)
	const [hash, setHash] = React.useState("")
	const [columnNames, setColumnNames] = React.useState([])

	React.useEffect(() => {
		window.fileSystemAPI.listFolder(folder).then((data) => {
			setTree(data)
			setHash(data.hash)

			try {
				setColumnNames(columns.split(", "))
			} catch (e) {
				setColumnNames([])
			}
		})
	}, [folder, hash, columns])

	// TODO: Collect colors in one place
	return (
		<div
			className={`w-full bg-${tree.color}-200 dark:bg-gray-500 rounded-lg shadow-lg p-4 my-4 flex flex-col space-y-2`}
		>
			<div className="text-center text-xs text-gray-700 dark:text-gray-300">
				{tree.readableName}
			</div>

			{tree.children && (
				<Conditional when={columns.length > 0}>
					<>
						{columnNames.map((columnName: string) => {
							const column: Folder = tree.children.find(
								(column) => column.isFolder && column.readableName === columnName,
							) as Folder

							return column && <ListView key={column.path} tree={column} subfolders={subfolders} />
						})}
					</>
					<>
						{tree.children.map((column: Folder) => (
							<ListView key={column.path} tree={column} subfolders={subfolders} />
						))}
					</>
				</Conditional>
			)}
		</div>
	)
}

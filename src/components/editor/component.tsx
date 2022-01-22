import React from "react"
import Scrollbars from "react-custom-scrollbars"
import { HiOutlineX } from "react-icons/hi"
import { getFileIcon } from "../../application/get-file-icon"
import { OrdoFile, OpenOrdoFile } from "../../application/types"
import { useAppSelector } from "../../common/store-hooks"
import { TextEditor } from "./text-editor"

const ImageViewer: React.FC = () => {
	const currentTab = useAppSelector((state) => state.application.currentFile)
	const tabs = useAppSelector((state) => state.application.openFiles)

	if (!tabs || !tabs[currentTab] || tabs[currentTab].type !== "image") {
		return null
	}

	return (
		<div className="flex items-center justify-center p-24">
			<img className="shadow-2xl" src={tabs[currentTab].body as unknown as string} />
		</div>
	)
}

const Viewer: React.FC<{ file: OrdoFile }> = ({ file }) => {
	switch (file.type) {
		case "image":
			return <ImageViewer />
		default:
			return (
				<div className="h-full">
					<Scrollbars>
						<TextEditor />
					</Scrollbars>
				</div>
			)
	}
}

const Tab: React.FC<{ tab: OpenOrdoFile; index: number }> = ({ tab, index }) => {
	const currentTab = useAppSelector((state) => state.application.currentFile)
	const Icon = getFileIcon(tab)

	return (
		<div
			key={tab.path}
			className={`flex flex-shrink text-gray-800 dark:text-gray-300 items-center space-x-2 cursor-pointer px-3 py-1 rounded-lg truncate ${
				currentTab === index && "bg-gray-100 dark:text-gray-800 shadow-md"
			}`}
			onClick={(e) => {
				e.preventDefault()
				window.ordo.emit("@application/set-current-file", index)
			}}
		>
			<Icon className="text-gray-500" />
			<div>{tab.readableName}</div>
			<HiOutlineX
				className="text-gray-500 hover:text-red-500"
				onClick={(e) => {
					e.preventDefault()
					window.ordo.emit("@application/close-file", index)
				}}
			/>
		</div>
	)
}

const Tabs: React.FC = () => {
	const tabs = useAppSelector((state) => state.application.openFiles)

	if (!tabs) {
		return null
	}

	return (
		<div className="flex items-center p-2 flex-wrap">
			{tabs.map((tab, index) => (
				<Tab key={tab.path} tab={tab} index={index} />
			))}
		</div>
	)
}

export const Editor: React.FC = () => {
	const tabs = useAppSelector((state) => state.application.openFiles)
	const currentTab = useAppSelector((state) => state.application.currentFile)

	if (!tabs || !tabs[currentTab]) {
		return null
	}

	return (
		<div className="flex flex-col grow bg-gray-50 dark:bg-gray-700 h-full">
			<Tabs />
			<div className="mb-10 h-full">
				<Viewer file={tabs[currentTab]} />
			</div>
		</div>
	)
}

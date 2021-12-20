import React from "react";
import Scrollbars from "react-custom-scrollbars";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getFolder, updateFolder } from "./state";
import { OrdoFile, OrdoFolder } from "./types";
import { File } from "./file";
import { getCollapseIcon } from "../common/get-folder-icon";
import { Folder } from "./folder";

export const Explorer: React.FC = () => {
	const dispatch = useAppDispatch();
	const tree = useAppSelector((state) => state.explorer.tree);
	const Icon = tree && getCollapseIcon(tree);

	React.useEffect(() => {
		dispatch(getFolder());
	}, []);

	return (
		tree && (
			<>
				<div
					style={{ width: "300px" }}
					className="cursor-pointer flex bg-gray-200 w-3/12 py-1 px-3 space-x-2 items-center fixed z-10"
					onClick={() => {
						dispatch(updateFolder({ path: tree.path, update: { collapsed: !tree.collapsed } }));
					}}
				>
					<Icon />
					<div className="font-bold text-gray-600 uppercase">{tree.readableName}</div>
				</div>
				<Scrollbars style={{ width: "300px" }} className="relative mt-8">
					<div className="mb-16">
						{!tree.collapsed &&
							tree.children.map((child) => (
								<div className="cursor-pointer" key={child.path}>
									{child.type === "folder" ? (
										<Folder folder={child as OrdoFolder} />
									) : (
										<File file={child as OrdoFile} />
									)}
								</div>
							))}
					</div>
				</Scrollbars>
			</>
		)
	);
};

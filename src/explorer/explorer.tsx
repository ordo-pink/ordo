import React from "react";
import Scrollbars from "react-custom-scrollbars";
import { useAppSelector } from "../redux/hooks";
import { OrdoFile, OrdoFolder } from "./types";
import { File } from "./file";
import { Folder } from "./folder";
import { Header } from "./header";

export const Explorer: React.FC = () => {
	const tree = useAppSelector((state) => state.explorerTree);

	return (
		tree && (
			<>
				<div
					style={{ width: "300px" }}
					className="flex items-center justify-between  fixed z-10 bg-gray-200 py-1 px-3 "
				>
					<Header />
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

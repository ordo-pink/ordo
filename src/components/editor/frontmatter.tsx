import React from "react";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";
import { useAppSelector } from "../../common/store-hooks";
import { OpenOrdoFile } from "../../application/types";

export const Frontmatter: React.FC<{ file: OpenOrdoFile }> = () => {
	const tabs = useAppSelector((state) => state.application.openFiles);
	const currentTab = useAppSelector((state) => state.application.currentFile);

	const file = tabs[currentTab];

	React.useEffect(() => {
		if (!file || !file.frontmatter) {
			setProps([]);
			return;
		}

		const properties: { key: string; value: unknown }[] = Object.keys(file.frontmatter).reduce(
			(acc, key) => acc.concat([{ key, value: (file.frontmatter as Record<string, unknown>)[key] }]),
			[] as { key: string; value: unknown }[],
		);

		setProps(properties);
	}, [file.frontmatter]);

	const [props, setProps] = React.useState<{ key: string; value: unknown }[]>([]);

	const updateProp = (field: "key" | "value", key: string, value: unknown) => {
		const propsCopy = [...props];

		const found = propsCopy.findIndex((prop) => prop.key === key);

		if (!~found) {
			return;
		}

		const updated = propsCopy[found];
		updated[field] = value as unknown as string;

		propsCopy.splice(found, 1, updated);

		setProps(propsCopy);

		window.ordo.emit("@application/save-props", propsCopy);
	};

	const addProperty = () => {
		const propsCopy = [...props];

		propsCopy.push({ key: "", value: "" });

		setProps(propsCopy);
	};

	return (
		<div className="mt-24 mb-6 mx-[10%]">
			<div className="flex justify-between items-center">
				<div className="text-3xl font-black text-gray-800">{file.readableName}</div>
				<HiOutlineQuestionMarkCircle
					className="text-gray-400 hover:text-pink-400 duration-1000 cursor-pointer transition-all"
					title={`Size: ${file.readableSize}
Path: ${file.relativePath}
Created: ${file.createdAt?.toLocaleString()}
Last updated: ${file.updatedAt?.toLocaleString()}`}
				/>
			</div>
			<div className="flex flex-col mt-5">
				{props.map((prop, index) => (
					<div className="flex" key={index}>
						<input
							onClick={() => window.ordo.emit("@application/set-focused-component", "Frontmatter")}
							onFocus={() => window.ordo.emit("@application/set-focused-component", "Frontmatter")}
							className="outline-none whitespace-pre-wrap text-gray-600 bg-gray-50 w-[40%] max-w-48"
							onChange={(e) => updateProp("key", prop.key, e.target.value)}
							placeholder="Property name"
							value={prop.key}
						/>
						<input
							onClick={() => window.ordo.emit("@application/set-focused-component", "Frontmatter")}
							onFocus={() => window.ordo.emit("@application/set-focused-component", "Frontmatter")}
							className="outline-none bg-gray-50 w-full text-gray-800"
							onChange={(e) => updateProp("value", prop.key, e.target.value)}
							placeholder="Property value"
							value={prop.value as unknown as string}
						/>
					</div>
				))}
			</div>
			<button onClick={() => addProperty()} className="text-gray-400 text-sm mt-2">
				+ Add property
			</button>
		</div>
	);
};

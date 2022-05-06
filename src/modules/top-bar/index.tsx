import React from "react";
import Fuse from "fuse.js";
import Scrollbars from "react-custom-scrollbars-2";

import { useAppDispatch, useAppSelector } from "@core/state/store";
import { Command } from "@modules/top-bar/components/command";
import { collectFiles } from "@modules/file-explorer/utils/collect-files";
import { File } from "@modules/top-bar/components/file";

export const TopBar: React.FC = () => {
	const dispatch = useAppDispatch();

	const value = useAppSelector((state) => state.topBar.value);
	const isFocused = useAppSelector((state) => state.topBar.focused);
	const items = useAppSelector((state) => state.app.commands);
	const tree = useAppSelector((state) => state.fileExplorer.tree);
	const currentTab = useAppSelector((state) => state.editor.currentTab);

	const [selected, setSelected] = React.useState(0);
	const [files, setFiles] = React.useState<any[]>([]);
	const [fusedCommands, setFusedCommands] = React.useState(items.map((item) => ({ item })));
	const [fusedFiles, setFusedFiles] = React.useState(files.map((item) => ({ item })));

	const ref = React.useRef<HTMLInputElement>(null);

	const commandFuse = React.useRef(
		new Fuse(items, {
			keys: ["name"],
		}),
	);

	const fileFuse = React.useRef(
		new Fuse(files, {
			keys: ["readableName", "relativePath", "path"],
		}),
	);

	React.useEffect(() => {
		fileFuse.current.setCollection(files);
	}, [files]);

	React.useEffect(() => {
		commandFuse.current.setCollection(items);
	}, [items]);

	React.useEffect(() => {
		if (value && value.startsWith(">")) {
			updateCommandList(value);
		} else {
			updateFileList(value);
		}
	}, [value]);

	const updateCommandList = (search: string) => {
		setFusedCommands(
			search === ">"
				? items.map((item) => ({ item }))
				: search.startsWith(">")
				? commandFuse.current.search(search.slice(1))
				: [],
		);
	};

	const updateFileList = (search: string) => {
		setFusedFiles(
			search === "@"
				? files.map((item) => ({ item }))
				: search.startsWith("@")
				? fileFuse.current.search(search.slice(1))
				: [],
		);
	};

	React.useEffect(() => {
		if (tree) {
			setFiles(collectFiles(tree));
		}
	}, [tree]);

	React.useEffect(() => {
		if (ref.current && isFocused != null) {
			if (isFocused) {
				ref.current.focus();
			} else {
				ref.current.blur();
			}
		}
	}, [isFocused]);

	return (
		<div
			style={{ appRegion: "drag" } as any}
			className="flex items-center justify-center pt-2 cursor-pointer select-none"
		>
			<div style={{ appRegion: "none" } as any} className="w-[50%] max-w-[600px] relative">
				<input
					ref={ref}
					type="text"
					value={value}
					onFocus={() => {
						dispatch({ type: "@editor/unfocus" });
						dispatch({ type: "@top-bar/focus" });
					}}
					onChange={(e) => {
						dispatch({ type: "@top-bar/set-value", payload: e.target.value });
						setSelected(0);

						if (e.target.value.startsWith(":") || Boolean(currentTab)) {
							const split = e.target.value.slice(1).split(":");
							dispatch({
								type: "@editor/update-caret-positions",
								payload: {
									path: currentTab,
									positions: [
										{
											start: { line: Number(split[0]) - 1, character: split[1] ? Number(split[1]) : 0 },
											end: { line: Number(split[0]) - 1, character: split[1] ? Number(split[1]) : 0 },
											direction: "ltr",
										},
									],
								},
							});
						}
					}}
					onBlur={() => {
						setTimeout(() => {
							dispatch({ type: "@top-bar/unfocus" });
						}, 100);
					}}
					onKeyDown={(e) => {
						if (e.key === "ArrowDown") {
							setSelected(
								value.startsWith(">")
									? selected === fusedCommands.length - 1
										? 0
										: selected + 1
									: selected === fusedFiles.length - 1
									? 0
									: selected + 1,
							);
						} else if (e.key === "ArrowUp") {
							setSelected(
								selected === 0 ? (value.startsWith(">") ? fusedCommands.length - 1 : fusedFiles.length - 1) : selected - 1,
							);
						} else if (e.key === "Enter") {
							dispatch({ type: "@top-bar/unfocus" });
							dispatch({ type: "@editor/focus" });
							dispatch({ type: "@top-bar/run-command", payload: fusedCommands[selected].item.event });
						} else if (e.key === "Escape") {
							ref.current?.blur();
							dispatch({ type: "@editor/focus" });
						}
					}}
					placeholder="Quick search (start with : to go to line, @ to go to file, or > to open commands)"
					className="w-full shadow-inner text-sm rounded-xl outline-none focus:outline-1 focus:outline-neutral-400 bg-neutral-200 dark:bg-neutral-600 px-2 py-1"
				/>
				{isFocused && value.startsWith(">") && (
					<div
						style={{ height: `${fusedCommands.length * 3.5}rem` }}
						className="fixed h-[70%] cursor-default z-50 mt-1 rounded-lg flex flex-col shadow-lg w-[50%] max-w-[600px] bg-neutral-100 dark:bg-neutral-600"
					>
						<Scrollbars autoHide={true}>
							<div>
								{fusedCommands &&
									fusedCommands.map(({ item }, index) => (
										<Command
											key={item.event}
											index={index}
											selected={selected}
											name={item.name}
											description={item.description}
											icon={item.icon}
											event={item.event}
											accelerator={item.accelerator}
											setSelected={setSelected}
										/>
									))}
							</div>
						</Scrollbars>
					</div>
				)}
				{isFocused && value.startsWith("@") && (
					<div
						style={{ height: `${fusedFiles.length * 1.75}rem` }}
						className="fixed max-h-[70%] cursor-default z-50 mt-1 rounded-lg flex flex-col shadow-lg w-[50%] max-w-[600px] bg-neutral-100 dark:bg-neutral-600"
					>
						<Scrollbars>
							<div>
								{fusedFiles &&
									fusedFiles.map(({ item }, index) => (
										<File
											key={item.path}
											index={index}
											readableName={item.readableName}
											relativePath={item.relativePath}
											size={item.size}
											path={item.path}
											type={item.type}
											selected={selected}
											setSelected={setSelected}
										/>
									))}
							</div>
						</Scrollbars>
					</div>
				)}
			</div>
		</div>
	);
};

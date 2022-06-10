import React from "react";
import Fuse from "fuse.js";

import { useAppDispatch, useAppSelector } from "@core/state/store";
import { Command } from "@modules/top-bar/components/command";
import { collectFiles } from "@modules/file-explorer/utils/collect-files";
import { File } from "@modules/top-bar/components/file";

import "@modules/top-bar/index.css";

/**
 * TopBar module provides easy access to finding things. It includes searching substring in
 * current file, searching a file in the project, accessing commands, and switching between
 * lines and chars in the document.
 * TODO: Make a universal component for TopBar list items
 * TODO: Fix switching between TopBar search modes (now it closes TopBar because of setTimeout)
 */
export const TopBar: React.FC = () => {
	const dispatch = useAppDispatch();

	const value = useAppSelector((state) => state.topBar.value);
	const isFocused = useAppSelector((state) => state.topBar.focused);
	const commands = useAppSelector((state) => state.app.commands);
	const tree = useAppSelector((state) => state.fileExplorer.tree);
	const currentTab = useAppSelector((state) => state.editor.currentTab);

	const [selected, setSelected] = React.useState(0);
	const [files, setFiles] = React.useState<any[]>([]);
	const [fusedCommands, setFusedCommands] = React.useState(commands.map((item) => ({ item })));
	const [fusedFiles, setFusedFiles] = React.useState(files.map((item) => ({ item })));
	const [height, setHeight] = React.useState<string>("0px");

	const ref = React.useRef<HTMLInputElement>(null);

	const commandFuse = React.useRef(new Fuse(commands, { keys: ["name"] }));
	const fileFuse = React.useRef(new Fuse(files, { keys: ["readableName", "relativePath", "path"] }));

	React.useEffect(() => {
		fileFuse.current.setCollection(files);
	}, [files]);

	React.useEffect(() => {
		commandFuse.current.setCollection(commands);
	}, [commands]);

	React.useEffect(() => {
		if (value.startsWith(">")) {
			setHeight(`${fusedCommands.length * 1.75}rem`);
		}

		if (value.startsWith("@")) {
			setHeight(`${fusedFiles.length * 1.75}rem`);
		}
	}, [value, fusedCommands.length, fusedFiles.length]);

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
				? commands.map((item) => ({ item }))
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

	const handleFocus = () => {
		dispatch({ type: "@editor/unfocus" });
		dispatch({ type: "@top-bar/focus" });
	};

	const handleBlur = () => {
		// TODO: Dragons here! Without setTimeout it goes to infinite rerendering when switching search views!
		setTimeout(() => {
			dispatch({ type: "@top-bar/unfocus" });
		}, 100);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		dispatch({ type: "@top-bar/set-value", payload: e.target.value });
		setSelected(0);

		if (e.target.value.startsWith(":") && Boolean(currentTab)) {
			e.stopPropagation();
			e.preventDefault();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			e.stopPropagation();

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
			e.preventDefault();
			e.stopPropagation();

			setSelected(
				selected === 0 ? (value.startsWith(">") ? fusedCommands.length - 1 : fusedFiles.length - 1) : selected - 1,
			);
		} else if (e.key === "Enter") {
			e.preventDefault();
			e.stopPropagation();

			dispatch({ type: "@top-bar/unfocus" });
			dispatch({ type: "@editor/focus" });
			value.startsWith(">")
				? dispatch({ type: "@top-bar/run-command", payload: fusedCommands[selected].item.event })
				: value.startsWith("@")
				? dispatch({ type: "@editor/open-tab", payload: fusedFiles[selected].item.path })
				: value.startsWith(":")
				? // TODO: Refactor this insanity
				  dispatch({
						type: "@editor/update-caret-positions",
						payload: [
							{
								start: {
									line: Number(value.slice(1).split(":")[0]),
									character: value.slice(1).split(":")[1] ? Number(value.slice(1).split(":")[1]) : 0,
								},
								end: {
									line: Number(value.slice(1).split(":")[0]),
									character: value.slice(1).split(":")[1] ? Number(value.slice(1).split(":")[1]) : 0,
								},
								direction: "ltr",
							},
						],
				  })
				: null;
		} else if (e.key === "Escape") {
			e.preventDefault();
			e.stopPropagation();

			ref.current?.blur();
			dispatch({ type: "@editor/focus" });
		}
	};

	return (
		<div className="top-bar">
			<div className="top-bar_wrapper">
				<input
					type="text"
					className="top-bar_input"
					placeholder="Quick search (start with : to go to line, @ to go to file, or > to open commands)"
					ref={ref}
					value={value}
					onFocus={handleFocus}
					onChange={handleChange}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
				/>
				{isFocused && value.startsWith(">") ? (
					<div style={{ height }} className="top-bar_list">
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
					</div>
				) : null}
				{isFocused && value.startsWith("@") ? (
					<div style={{ height }} className="top-bar_list">
						<div>
							{fusedFiles &&
								fusedFiles.map(({ item }, index) => (
									<File
										key={item.path}
										index={index}
										readableName={item.readableName}
										size={item.size}
										path={item.path}
										type={item.type}
										selected={selected}
										setSelected={setSelected}
									/>
								))}
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
};

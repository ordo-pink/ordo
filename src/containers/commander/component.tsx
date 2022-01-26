import React from "react";
import { useAppSelector } from "../../common/store-hooks";
import { getSupportedIcon } from "../../application/appearance/icons/supported-icons";
import { Command } from "./types";
import Fuse from "fuse.js";

const Shortcut = React.memo<{ shortcut: string }>(({ shortcut }) => {
	if (!shortcut) {
		return null;
	}

	const split = shortcut.split("+");

	return (
		<div className="flex align-baseline items-center space-x-1">
			{split.includes("CommandOrControl") && <kbd className="border border-gray-200 bg-gray-100 rounded-md px-2">⌘</kbd>}
			{split.includes("Shift") && <kbd className="border border-gray-200 bg-gray-100 rounded-md px-2">⇧</kbd>}
			{split.includes("Alt") && <kbd className="border border-gray-200 bg-gray-100 rounded-md px-2">⌥</kbd>}
			<kbd className="border border-gray-200 bg-gray-100 rounded-md px-2">{split[split.length - 1]}</kbd>
		</div>
	);
});

const Command: React.FC<Command & { selected: number; index: number }> = ({
	icon,
	name,
	description,
	shortcut,
	event,
	selected,
	index,
}) => {
	const Icon = icon ? getSupportedIcon(icon) : () => null;
	const isSelected = selected === index;

	return (
		<div
			className={`flex space-x-2 text-sm hover:bg-gray-200 text-gray-500 p-2 last-of-type:rounded-b-lg cursor-pointer select-none ${
				isSelected && "bg-gray-200"
			}`}
		>
			<div className="flex-grow" onClick={() => window.ordo.emit("@commander/run", event)}>
				<div className="flex items-center space-x-2">
					<Icon />
					<div className="text-gray-700">{name}</div>
				</div>

				<div>{description}</div>
			</div>
			<Shortcut shortcut={shortcut as string} />
		</div>
	);
};

export const Commander: React.FC = () => {
	const show = useAppSelector((state) => state.commander.show);
	const items = useAppSelector((state) => state.commander.items);

	const fuse = new Fuse(items, {
		keys: ["name"],
	});

	const [filter, setFilter] = React.useState("");
	const [selected, setSelected] = React.useState(0);
	const [fused, setFused] = React.useState(items.map((item) => ({ item })));

	if (!show) {
		return null;
	}

	return (
		<div>
			<input
				className="w-full outline-none p-2 rounded-lg"
				placeholder="What is that you truely desire?"
				autoFocus={show}
				type="text"
				value={filter}
				onKeyDown={(e) => {
					if (e.key === "ArrowDown") {
						setSelected(selected === fused.length - 1 ? 0 : selected + 1);
					} else if (e.key === "ArrowUp") {
						setSelected(selected === 0 ? fused.length - 1 : selected - 1);
					} else if (e.key === "Enter") {
						window.ordo.emit("@commander/run", fused[selected].item.event);
					} else if (e.key === "Escape") {
						window.ordo.emit("@commander/hide");
						setFilter("");
					}
				}}
				onChange={(e) => {
					setFilter(e.target.value);
					setSelected(0);
					setFused(e.target.value ? fuse.search(e.target.value) : items.map((item) => ({ item })));
				}}
			/>
			<div className="rounded-b-lg">
				{fused.map(({ item }, index) => (
					<Command
						index={index}
						selected={selected}
						key={item.name}
						name={item.name}
						description={item.description}
						icon={item.icon}
						shortcut={item.shortcut}
						event={item.event}
					/>
				))}
			</div>
		</div>
	);
};

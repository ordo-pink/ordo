import { useAppSelector } from "@core/state/store";
import React from "react";
import Scrollbars from "react-custom-scrollbars";
import { Command } from "./components/command";
import Fuse from "fuse.js";

export const TopBar: React.FC = () => {
	const value = useAppSelector((state) => state.topBar.value);
	const isFocused = useAppSelector((state) => state.topBar.focused);
	const items = useAppSelector((state) => state.app.commands);

	const updateCommandList = (search: string) => {
		setFused(search === ">" ? items.map((item) => ({ item })) : fuse.search(search));
	};

	const ref = React.useRef<HTMLInputElement>(null);

	const [selected, setSelected] = React.useState(0);
	const [fuse, setFuse] = React.useState<any>(null);
	const [fused, setFused] = React.useState(items.map((item) => ({ item })));

	React.useEffect(() => {
		if (ref.current && isFocused != null) {
			if (isFocused) {
				ref.current.focus();

				setFuse(
					new Fuse(items, {
						keys: ["name"],
					}),
				);
			} else {
				ref.current.blur();
			}
		}

		return () => {
			setFuse(null);
		};
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
						window.ordo.emit("@top-bar/focus", null);
						updateCommandList(value);
					}}
					onChange={(e) => {
						window.ordo.emit("@top-bar/set-value", e.target.value);
						setSelected(0);
						updateCommandList(e.target.value);
					}}
					onBlur={() => {
						setTimeout(() => window.ordo.emit("@top-bar/unfocus", null), 100);
					}}
					onKeyDown={(e) => {
						if (e.key === "ArrowDown") {
							setSelected(selected === fused.length - 1 ? 0 : selected + 1);
						} else if (e.key === "ArrowUp") {
							setSelected(selected === 0 ? fused.length - 1 : selected - 1);
						} else if (e.key === "Enter") {
							window.ordo.emit("@top-bar/run-command", fused[selected].item.event);
							window.ordo.emit("@top-bar/unfocus", null);
						} else if (e.key === "Escape") {
							ref.current?.blur();
						}
					}}
					placeholder="Quick search (start with : to go to line, @ to go to file, or > to open commands)"
					className="w-full shadow-inner text-sm rounded-xl outline-none focus:outline-1 focus:outline-neutral-400 bg-neutral-200 dark:bg-neutral-600 px-2 py-1"
				/>
				{isFocused && value.startsWith(">") && (
					<div className="fixed h-[70%] cursor-default z-50 mt-1 rounded-lg flex flex-col shadow-lg w-[50%] max-w-[600px] bg-neutral-100 dark:bg-neutral-600">
						<Scrollbars>
							<div>
								{fused &&
									fused.map(({ item }, index) => (
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
			</div>
		</div>
	);
};

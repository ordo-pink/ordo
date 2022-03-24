import { useAppDispatch, useAppSelector } from "@core/state/hooks";
import React from "react";
import { setTopBarValue, unfocusTopBar } from "./top-bar-slice";

export const TopBar: React.FC = () => {
	const dispatch = useAppDispatch();
	const value = useAppSelector((state) => state.topBar.value);
	const isFocused = useAppSelector((state) => state.topBar.focused);

	const ref = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		if (ref.current && isFocused != null) {
			isFocused ? ref.current.focus() : ref.current.blur();
		}
	}, [isFocused]);

	return (
		<div style={{ appRegion: "drag" } as any} className="flex items-center justify-center pt-2 cursor-pointer">
			<div style={{ appRegion: "none" } as any} className="w-[60%]">
				<input
					ref={ref}
					type="text"
					value={value}
					onChange={(e) => dispatch(setTopBarValue(e.target.value))}
					onBlur={() => dispatch(unfocusTopBar())}
					onKeyDown={(e) => {
						if (e.key === "Escape") {
							dispatch(setTopBarValue(""));
							ref.current?.blur();
						}
					}}
					placeholder="Quick search (start with : to go to line, @ to go to file, or > to open commands)"
					className="w-full shadow-inner text-sm rounded-xl outline-none focus:outline-1 focus:outline-neutral-400 bg-neutral-200 dark:bg-neutral-600 px-2 py-1"
				/>
			</div>
		</div>
	);
};

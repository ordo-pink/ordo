import React from "react";

export const EmptyEditor: React.FC = () => (
	<div className="flex items-center justify-center w-full h-[calc(100vh-3rem)] select-none cursor-default">
		<h1 className="text-9xl font-black bg-gradient-to-bl from-neutral-500 to-pink-700 text-transparent bg-clip-text drop-shadow-xl">
			||✔
		</h1>
	</div>
);

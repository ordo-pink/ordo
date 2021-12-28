import React from "react";

export const Welcome: React.FC = () => {
	return (
		<div className="flex flex-col flex-grow w-full h-full justify-center items-center text-gray-600 mt-[-3rem]">
			<h2 className="text-lg tracking-wider border-b border-gray-400">Bring your thoughts to</h2>
			<h1 className="font-bold text-7xl text-gray-700">ORDO</h1>
		</div>
	);
};

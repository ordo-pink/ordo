import React from "react";

export const WelcomePage: React.FC = () => {
	const [logo, setLogo] = React.useState("ORDO");

	return (
		<div className="flex flex-col flex-grow w-full h-full justify-center items-center text-gray-600 dark:text-gray-300 mt-[-3rem]">
			<h2 className="text-lg uppercase tracking-wider border-b border-gray-400">Bring your thoughts to</h2>
			<h1
				className="font-bold text-8xl bg-gradient-to-bl from-orange-600 to-pink-700 text-transparent bg-clip-text drop-shadow-xl"
				onMouseEnter={() => setLogo("||☑️")}
				onMouseLeave={() => setLogo("ORDO")}
			>
				{logo}
			</h1>
		</div>
	);
};

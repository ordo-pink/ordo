import { useAppSelector } from "@core/state/store";
import React from "react";
import { HiOutlineCog, HiOutlineFolderOpen } from "react-icons/hi";
import { animated, config, useTransition } from "react-spring";

const BringYourThoughts: React.FC = () => {
	const transitions = useTransition(true, {
		from: { position: "absolute", opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
		delay: 200,
		config: config.molasses,
	});

	return transitions(({ opacity }) => (
		<animated.h1
			className="text-lg uppercase tracking-wider border-b border-gray-400"
			style={{ opacity: opacity.to({ range: [1.0, 0.0], output: [1, 0] }) }}
		>
			Bring your thoughts to
		</animated.h1>
	));
};

const Logo: React.FC = () => {
	const [toggle, set] = React.useState(false);
	const transitions = useTransition(toggle, {
		from: { position: "absolute", opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
		delay: 200,
		config: config.molasses,
	});

	return transitions(({ opacity }, item) =>
		item ? (
			<animated.h1
				className="cursor-pointer font-bold text-8xl bg-gradient-to-bl from-orange-600 to-pink-700 text-transparent bg-clip-text drop-shadow-xl"
				style={{ position: "absolute", opacity: opacity.to({ range: [0.0, 1.0], output: [0, 1] }) }}
				onClick={() => set(!toggle)}
			>
				||☑️
			</animated.h1>
		) : (
			<animated.h1
				className="cursor-pointer font-bold text-8xl bg-gradient-to-bl from-orange-600 to-pink-700 text-transparent bg-clip-text drop-shadow-xl"
				style={{ position: "absolute", opacity: opacity.to({ range: [1.0, 0.0], output: [1, 0] }) }}
				onClick={() => set(!toggle)}
			>
				ORDO
			</animated.h1>
		),
	);
};

export const WelcomePage: React.FC = () => {
	const recentProjects = useAppSelector((state) => state.app.internalSettings.window?.recentProjects);

	return (
		<div className="select-none -z-50 flex flex-col flex-grow w-full h-full justify-center items-center text-gray-600 dark:text-gray-300 mt-10">
			<div className="mb-24">
				<BringYourThoughts />
				<div className="w-full flex items-center justify-center mt-11">
					<Logo />
				</div>
			</div>
			<div className="flex space-x-24 justify-center">
				{recentProjects && recentProjects.length > 0 && (
					<div>
						<h2 className="text-xl mb-2">Recent Projects</h2>
						{recentProjects.map((project) => (
							<div
								key={project}
								className="bg-neutral-200 dark:bg-neutral-600 mb-2 py-1 px-3 rounded-lg hover:underline cursor-pointer"
								onClick={() => {
									window.ordo.emit("@file-explorer/list-folder", project);
									window.ordo.emit("@side-bar/show", null);
									window.ordo.emit("@activity-bar/open-editor", null);
								}}
							>
								.../{project.split("/").slice(-3).join("/")}
							</div>
						))}
					</div>
				)}
				<div>
					<h2 className="text-xl mb-2">Quick Actions</h2>
					<button
						className="flex space-x-2 items-center hover:text-pink-500 transition-all duration-300"
						onClick={() => {
							window.ordo.emit("@app/select-project", null);
							window.ordo.emit("@side-bar/show", null);
							window.ordo.emit("@activity-bar/open-editor", null);
						}}
					>
						<HiOutlineFolderOpen />
						<span>Open Folder</span>
					</button>
					<button
						className="flex space-x-2 items-center hover:text-pink-500 transition-all duration-300"
						onClick={() => window.ordo.emit("@activity-bar/select", "Settings")}
					>
						<HiOutlineCog />
						<span>Settings</span>
					</button>
				</div>
			</div>
		</div>
	);
};

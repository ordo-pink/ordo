import { showSidebar } from "@containers/sidebar/sidebar-slice";
import { useAppDispatch } from "@core/state/hooks";
import { selectActivity } from "@modules/activity-bar/activity-bar-slice";
import { listFolder, selectProjectFolder } from "@modules/file-explorer/file-explorer-slice";
import React from "react";
import { HiOutlineCog, HiOutlineFolderOpen } from "react-icons/hi";
import { animated, config, useTransition } from "react-spring";

const BringYourThoughts = () => {
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

const Logo = () => {
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
	const [recentProjects, setRecentProjects] = React.useState<string[]>([]);

	const dispatch = useAppDispatch();

	React.useEffect(() => {
		window.ordo
			.emit<string[]>("@application/get-setting", "window.recentProjects")
			.then((projects) => setRecentProjects(projects));
	}, []);

	return (
		<div className="select-none flex flex-col flex-grow w-full h-full justify-center items-center text-gray-600 dark:text-gray-300 mt-[-3rem]">
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
									dispatch(listFolder(project));
									dispatch(selectActivity("Editor"));
									dispatch(showSidebar());
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
							dispatch(selectProjectFolder());
							dispatch(selectActivity("Editor"));
							dispatch(showSidebar());
						}}
					>
						<HiOutlineFolderOpen />
						<span>Open Folder</span>
					</button>
					<button
						className="flex space-x-2 items-center hover:text-pink-500 transition-all duration-300"
						onClick={() => dispatch(selectActivity("Settings"))}
					>
						<HiOutlineCog />
						<span>Settings</span>
					</button>
				</div>
			</div>
		</div>
	);
};

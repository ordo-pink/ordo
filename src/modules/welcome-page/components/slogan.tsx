import React from "react";
import { animated, config, useTransition } from "react-spring";

export const Slogan: React.FC = () => {
	const transitions = useTransition(true, {
		from: { position: "absolute", opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
		delay: 200,
		config: config.molasses,
	});

	return transitions(({ opacity }) => (
		<animated.h1
			className="welcome-page_bring-your-thoughts-to"
			style={{ opacity: opacity.to({ range: [1.0, 0.0], output: [1, 0] }) }}
		>
			Bring your thoughts to
		</animated.h1>
	));
};

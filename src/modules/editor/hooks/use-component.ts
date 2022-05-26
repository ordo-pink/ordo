import { NodeWithChars } from "@core/parser/types";
import { GraphComponent } from "@modules/graph/graph-component";
import { TextNodeWithCharsType } from "@modules/text-parser/enums";
import { NoOp } from "@utils/no-op";
import { Switch } from "or-else";
import React from "react";

export const useComponent = (token: NodeWithChars) => {
	const component = React.useMemo(() => {
		if (token.type !== TextNodeWithCharsType.COMPONENT) {
			return NoOp;
		}

		const componentName = token.raw.slice(1, token.raw.indexOf(" "));

		return Switch.of(componentName).case("Graph", GraphComponent).default(NoOp);
	}, [token]);

	return component;
};

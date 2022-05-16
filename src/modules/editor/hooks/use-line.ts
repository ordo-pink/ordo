import { Either } from "or-else";

import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { TokenWithChildren } from "@modules/md-parser/types";

export const useLine = (index: number) => {
	const { eitherTab } = useCurrentTab();

	return eitherTab
		.chain((t) => Either.fromNullable(t.parsed))
		.chain((parsed) => Either.fromNullable(parsed.children[index] as TokenWithChildren));
};

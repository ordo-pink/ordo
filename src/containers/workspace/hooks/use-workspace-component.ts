import { Switch } from "or-else";

import { Editor } from "@modules/editor";
import { WelcomePage } from "@modules/welcome-page";

export const useWorkspaceComponent = (currentActivity: string) =>
	Switch.of(currentActivity).case("Editor", Editor).default(WelcomePage);

import { Switch } from "or-else";

import { Editor } from "@modules/editor";
import { WelcomePage } from "@modules/welcome-page";
import { Settings } from "@core/settings";

export const useWorkspaceComponent = (currentActivity: string) =>
	Switch.of(currentActivity).case("Editor", Editor).case("Settings", Settings).default(WelcomePage);

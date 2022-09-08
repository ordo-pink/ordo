import { SupportedIcon } from "@core/hooks/use-icon";
import { OrdoEvent } from "@core/types";

export type ActivityBarItem = {
  isShown: boolean;
  name: string;
  icon: SupportedIcon;
};

export type ActivityBarState = {
  current: string;
  items: ActivityBarItem[];
};

export type ACTIVITY_BAR_SCOPE = "activity-bar";

export type ActivityBarSelectEvent = OrdoEvent<ACTIVITY_BAR_SCOPE, "select", string>;
export type OpenEditorEvent = OrdoEvent<ACTIVITY_BAR_SCOPE, "open-editor">;
export type OpenGraphEvent = OrdoEvent<ACTIVITY_BAR_SCOPE, "open-graph">;
export type OpenFindInFilesEvent = OrdoEvent<ACTIVITY_BAR_SCOPE, "open-find-in-files">;
export type OpenWelcomePageEvent = OrdoEvent<ACTIVITY_BAR_SCOPE, "open-welcome-page">;
export type OpenAchievementsEvent = OrdoEvent<ACTIVITY_BAR_SCOPE, "open-achievements">;
export type OpenSettingsEvent = OrdoEvent<ACTIVITY_BAR_SCOPE, "open-settings">;
export type OpenCheckboxesEvent = OrdoEvent<ACTIVITY_BAR_SCOPE, "open-checkboxes">;

export type ActivityBarEvents = ActivityBarSelectEvent &
  OpenEditorEvent &
  OpenGraphEvent &
  OpenSettingsEvent &
  OpenCheckboxesEvent &
  OpenWelcomePageEvent;

import { OrdoEventHandler } from "@core/types";

/**
 * Triggers hiding the SideBar. This method does not change width of the SideBar so that it can be
 * reopened with the same width as it was before.
 */
export const handleHide: OrdoEventHandler<"@side-bar/hide"> = ({ draft }) => {
  draft.sideBar.isShown = false;
};

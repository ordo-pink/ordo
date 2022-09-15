import { ActivityBarState } from "@modules/activity-bar/types";

const initialState: ActivityBarState = {
  current: "WelcomePage",
  items: [
    { isShown: true, name: "Editor", icon: "BsLayoutTextWindow" },
    { isShown: true, name: "Graph", icon: "BsShare" },
    { isShown: false, name: "Find in Files", icon: "BsSearch" },
    { isShown: true, name: "Checkboxes", icon: "BsCheck2Square" },
    { isShown: false, name: "Tags", icon: "BsTags" },
    { isShown: false, name: "Calendar", icon: "BsCalendarDate" },
    { isShown: false, name: "WelcomePage", icon: "HiOutlineInbox" },
    { isShown: false, name: "Achievements", icon: "BsAward" },
    { isShown: false, name: "Settings", icon: "FaCogs" },
  ],
};

export default initialState;

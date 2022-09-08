import { ActivityBarState } from "@modules/activity-bar/types";

const initialState: ActivityBarState = {
  current: "WelcomePage",
  items: [
    { isShown: true, name: "Editor", icon: "HiOutlineDocumentText" },
    { isShown: true, name: "Graph", icon: "HiOutlineShare" },
    { isShown: true, name: "Checkboxes", icon: "HiOutlineCheckCircle" },
    { isShown: false, name: "Find in Files", icon: "HiOutlineSearch" },
    { isShown: false, name: "WelcomePage", icon: "HiOutlineInbox" },
    { isShown: false, name: "Achievements", icon: "HiOutlineSparkles" },
    { isShown: false, name: "Settings", icon: "HiOutlineCog" },
  ],
};

export default initialState;

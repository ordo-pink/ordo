import { ActivityBarState } from "@modules/activity-bar/types";

const initialState: ActivityBarState = {
  current: "WelcomePage",
  items: [
    { show: true, name: "Editor", icon: "HiOutlineDocumentText" },
    { show: true, name: "Graph", icon: "HiOutlineShare" },
    { show: true, name: "Checkboxes", icon: "HiOutlineCheckCircle" },
    { show: false, name: "Find in Files", icon: "HiOutlineSearch" },
    { show: false, name: "WelcomePage", icon: "HiOutlineInbox" },
    { show: false, name: "Achievements", icon: "HiOutlineSparkles" },
    { show: false, name: "Settings", icon: "HiOutlineCog" },
  ],
};

export default initialState;

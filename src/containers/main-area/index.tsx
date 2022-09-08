import React, { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@core/state/store";
import { TopBar } from "@modules/top-bar";
import { WindowState } from "@init/types";
import { SplitDirection } from "@containers/split-view/split-direction";

import Split from "@containers/split-view/split";
import Workspace from "@containers/workspace";
import Sidebar from "@containers/side-bar";

import "@containers/main-area/index.css";

/**
 * MainArea component is a wrapper for TopBar, Workspace and SideBar.
 */
const MainArea = () => {
  const dispatch = useAppDispatch();

  const isSideBarShown = useAppSelector((state) => state.sideBar.isShown);
  const sideBarWidth = useAppSelector(getSideBarWidth);

  const [sectionSizes, setSectionSizes] = useState<[number, number]>([100, 0]);

  const handleDragEnd = (sectionSizes: [number, number]) => {
    const payload = sectionSizes[1];

    dispatch({ type: "@side-bar/set-width", payload });
  };

  useEffect(() => {
    let leftSectionWidth = 100;
    let rightSectionWidth = 0;

    if (isSideBarShown) {
      leftSectionWidth -= sideBarWidth;
      rightSectionWidth += sideBarWidth;
    }

    setSectionSizes([leftSectionWidth, rightSectionWidth]);
  }, [isSideBarShown, sideBarWidth]);

  return (
    <div className="main-area">
      <TopBar />
      <Split sizes={sectionSizes} snapOffset={200} onDragEnd={handleDragEnd} direction={SplitDirection.HORIZONTAL}>
        <Workspace />
        <Sidebar />
      </Split>
    </div>
  );
};

const getSideBarWidth = ({ app, sideBar }: WindowState) => sideBar.width || app.internalSettings.window?.sideBarWidth;

export default MainArea;

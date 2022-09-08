import React, { useState, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@core/state/store";
import { HorizontalSplit } from "@containers/split-view/horizontal-split";
import { Workspace } from "@containers/workspace";
import { Sidebar } from "@containers/side-bar";
import { TopBar } from "@modules/top-bar";
import { WindowState } from "@init/types";

import "@containers/main-area/index.css";

/**
 * MainArea component is a wrapper for TopBar, Workspace and SideBar.
 */
export const MainArea = () => {
  const dispatch = useAppDispatch();

  const isSideBarShown = useAppSelector((state) => state.sideBar.isShown);
  const sideBarWidth = useAppSelector(getSideBarWidth);

  const [sectionSizes, setSectionSizes] = useState<[number, number]>([100, 0]);

  const handleDragEnd = (sectionSizes: [number, number]) => {
    const payload = sectionSizes[1];

    dispatch({ type: "@side-bar/set-width", payload });
  };

  useEffect(() => {
    const sizes: [number, number] = [100, 0];

    if (isSideBarShown) {
      sizes[0] -= sideBarWidth; // The left one gets smaller
      sizes[1] += sideBarWidth; // The right one gets bigger
    }

    setSectionSizes(sizes);
  }, [isSideBarShown, sideBarWidth]);

  return (
    <div className="main-area">
      <TopBar />
      <HorizontalSplit sizes={sectionSizes} snapOffset={200} onDragEnd={handleDragEnd}>
        <Workspace />
        <Sidebar />
      </HorizontalSplit>
    </div>
  );
};

const getSideBarWidth = ({ app, sideBar }: WindowState) => sideBar.width || app.internalSettings.window?.sideBarWidth;

import React from "react";
import { Either } from "or-else";

import { useAppDispatch, useAppSelector } from "@core/state/store";
import { HorizontalSplit } from "@containers/split-view/horizontal-split";
import { Workspace } from "@containers/workspace";
import { Sidebar } from "@containers/side-bar";
import { TopBar } from "@modules/top-bar";
import { FoldVoid, fromBoolean } from "@utils/either";

import "@containers/main-area/index.css";

/**
 * MainArea component is a wrapper for TopBar, Workspace and SideBar.
 */
export const MainArea: React.FC = () => {
  const dispatch = useAppDispatch();

  const showSidebar = useAppSelector((state) => state.sideBar.show);
  const sideBarWidth = useAppSelector((state) => state.sideBar.width);
  const settingsSideBarWidth = useAppSelector((state) => state.app.internalSettings.window?.sideBarWidth);

  const [targetSideBarWidth, setTargetSideBarWidth] = React.useState<number>(sideBarWidth);
  const [sizes, setSizes] = React.useState<[number, number]>([100, 0]);

  const handleDragEnd = (sizes: [number, number]) =>
    Either.right(sizes)
      .map((sizes) => sizes[1])
      .map((payload) => dispatch({ type: "@side-bar/set-width", payload }))
      .fold(...FoldVoid);

  React.useEffect(() => {
    fromBoolean(showSidebar).fold(
      () => setSizes([100, 0]),
      () => setSizes([100 - targetSideBarWidth, targetSideBarWidth]),
    );
  }, [showSidebar, targetSideBarWidth]);

  React.useEffect(() => {
    Either.fromNullable(setTargetSideBarWidth).fold(
      () => setTargetSideBarWidth(settingsSideBarWidth),
      () => setTargetSideBarWidth(sideBarWidth),
    );
  }, [sideBarWidth, settingsSideBarWidth]);

  return (
    <div className="main-area">
      <TopBar />
      <HorizontalSplit sizes={sizes} snapOffset={200} onDragEnd={handleDragEnd}>
        <Workspace />
        <Sidebar />
      </HorizontalSplit>
    </div>
  );
};

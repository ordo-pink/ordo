import React from "react";

import { FileExplorer } from "@modules/file-explorer";

import "@containers/side-bar/index.css";

export const Sidebar = () => (
  <div className="sidebar">
    <FileExplorer />
  </div>
);

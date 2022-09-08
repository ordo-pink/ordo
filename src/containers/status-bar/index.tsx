import React from "react";

import { Notifications } from "@modules/notifications";
import { EditorStatus } from "@modules/editor/components/editor-status";

import "@containers/status-bar/index.css";

/**
 * StatusBar is a wrapper component for custom informative views and Notifications.g
 */
export const StatusBar: React.FC = () => {
  return (
    <div className="status-bar">
      <div className="status-bar_side-container">
        <EditorStatus />
      </div>

      <Notifications />
    </div>
  );
};

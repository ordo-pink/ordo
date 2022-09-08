import React from "react";

import { useInternationalisation } from "@containers/app/hooks/use-i18n";
import { useMainState } from "./hooks/use-main-state";

import { ActivityBar } from "@modules/activity-bar";
import StatusBar from "@containers/status-bar";
import MainArea from "@containers/main-area";

import "@containers/app/index.css";

/**
 * App is a wrapper for ActivityBar, MainArea and StatusBar. It is also the top level
 * component in the frontend application, and it scaffolds the connection between the
 * frontend and the backend. It requests initial data from the backend for state
 * syncrchronisation, and registers listeners for backend state updates.
 */
const App = () => {
  useInternationalisation();
  useMainState();

  return (
    <>
      <div className="main-section-wrapper">
        <ActivityBar />
        <MainArea />
      </div>
      <div className="status-bar-wrapper">
        <StatusBar />
      </div>
    </>
  );
};

export default App;

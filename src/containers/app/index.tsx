import React from "react";

import { applyStatePatches, setState, useInternalDispatch, useAppDispatch, useAppSelector } from "@core/state/store";
import { StatusBar } from "@containers/status-bar";
import { MainArea } from "@containers/main-area";
import { ActivityBar } from "@modules/activity-bar";
import i18n from "../../i18n";

import "@containers/app/index.css";
import { Either } from "or-else";
import { FoldVoid } from "@utils/either";

/**
 * App is a wrapper for ActivityBar, MainArea and StatusBar. It is also the top level
 * component in the frontend application, and it scaffolds the connection between the
 * frontend and the backend. It requests initial data from the backend for state
 * syncrchronisation, and registers listeners for backend state updates.
 */
export const App: React.FC = () => {
  const internalDispatch = useInternalDispatch();
  const dispatch = useAppDispatch();

  const locale = useAppSelector((state) => state.app.userSettings?.appearance?.language);

  const handleApplyPatches = React.useCallback(({ detail }: any) => internalDispatch(applyStatePatches(detail)), []);
  const handleSetState = React.useCallback(({ detail }: any) => internalDispatch(setState(detail)), []);

  React.useEffect(() => {
    dispatch({ type: "@app/get-state" });
    dispatch({ type: "@app/get-internal-settings" });
    dispatch({ type: "@app/get-user-settings" });

    window.addEventListener("@app/set-state", handleSetState);
    window.addEventListener("@app/apply-patches", handleApplyPatches);

    return () => {
      window.removeEventListener("@app/set-state", handleApplyPatches);
      window.removeEventListener("@app/apply-patches", handleApplyPatches);
    };
  }, []);

  React.useEffect(() => void Either.fromNullable(locale).fold(FoldVoid[0], i18n.changeLanguage), [locale]);

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

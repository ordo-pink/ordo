import { Accelerator } from "@modules/top-bar/components/accelerator";
import { Logo } from "@modules/welcome-page/components/logo";
import { Slogan } from "@modules/welcome-page/components/slogan";
import React from "react";

export const EmptyEditor: React.FC = React.memo(
  () => (
    <div className="welcome-page">
      <Slogan />
      <Logo />
      <div className="welcome-page_actions-container">
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2 items-center">
            <Accelerator accelerator="CommandOrControl+P" />
            <div>to quickly access a file</div>
          </div>
          <div className="flex space-x-2 items-center">
            <Accelerator accelerator="CommandOrControl+Shift+B" />
            <div>to toggle sidebar</div>
          </div>
          <div className="flex space-x-2 items-center">
            <Accelerator accelerator="CommandOrControl+Shift+P" />
            <div>to show all commands</div>
          </div>
          <div className="flex space-x-2 items-center">
            <Accelerator accelerator="CommandOrControl+Shift+G" />
            <div>to open project graph</div>
          </div>
          <div className="flex space-x-2 items-center">
            <Accelerator accelerator="CommandOrControl+Shift+C" />
            <div>to see all checkboxes</div>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2 items-center">
            <Accelerator accelerator="Alt+G" />
            <div>to go to line</div>
          </div>
          <div className="flex space-x-2 items-center">
            <Accelerator accelerator="CommandOrControl+Alt+R" />
            <div>to reveal current file in File Explorer</div>
          </div>
          <div className="flex space-x-2 items-center">
            <Accelerator accelerator="CommandOrControl+Alt+C" />
            <div>to copy current file path</div>
          </div>
        </div>
      </div>
    </div>
  ),
  () => true,
);

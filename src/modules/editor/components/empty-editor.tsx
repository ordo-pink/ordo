import { Accelerator } from "@modules/top-bar/components/accelerator";
import { Logo } from "@modules/welcome-page/components/logo";
import { Slogan } from "@modules/welcome-page/components/slogan";
import React from "react";

export const EmptyEditor: React.FC = React.memo(
  () => <div className="welcome-page"></div>,
  () => true,
);

import React from "react";

import { useAppSelector } from "@core/state/store";
import i18n from "../../../i18n";

export const useInternationalisation = () => {
  const language = useAppSelector((state) => state.app.userSettings?.appearance?.language);

  React.useEffect(() => {
    if (!language) return;

    i18n.changeLanguage(language);
  }, [language]);
};

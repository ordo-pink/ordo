import { useEffect } from "react";

import { useAppSelector } from "@core/state/store";
import i18n from "../../../i18n";

export const useInternationalisation = () => {
  const language = useAppSelector((state) => state.app.userSettings?.appearance?.language);

  useEffect(() => {
    if (!language) return;

    i18n.changeLanguage(language);
  }, [language]);
};

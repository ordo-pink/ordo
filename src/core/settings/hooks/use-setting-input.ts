import { Switch } from "or-else";

import SelectSetting from "@core/settings/components/select-setting";
import CheckboxSetting from "@core/settings/components/checkbox-setting";
import { NoOp } from "@utils/functions";

export const useSettingInput = (property: any) =>
  Switch.of(property)
    .case((prop: any) => prop.enum, SelectSetting)
    .case((prop: any) => prop.type === "boolean", CheckboxSetting)
    .default(NoOp);

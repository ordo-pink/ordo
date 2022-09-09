import React from "react";

import { useAppDispatch } from "@core/state/store";
import { CheckStatus } from "@modules/checkboxes/constants";

// TODO: Require specific line!
type Props = {
  filePath: string;
  label: string;
  checked: boolean;
};

/**
 * Checkbox input for the Checkboxes module.
 */
const Checkbox = ({ filePath, label, checked }: Props) => {
  const dispatch = useAppDispatch();

  const handleChange = () => {
    const currentCheckboxMarkup = checked ? CheckStatus.CHECKED : CheckStatus.UNCHECKED;
    const newCheckboxMarkup = checked ? CheckStatus.UNCHECKED : CheckStatus.CHECKED;

    const oldContent = `${currentCheckboxMarkup}${label}`;
    const newContent = `${newCheckboxMarkup}${label}`;

    const payload = { oldContent, newContent, path: filePath };

    dispatch({ type: "@file-explorer/replace-line", payload });
  };

  const labelClassName = checked ? "checkbox_text_checked" : "";

  return (
    <label className="checkbox">
      <input checked={checked} type="checkbox" className="block w-5 h-5 text-green-700" onChange={handleChange} />
      <div className={labelClassName}>{label}</div>
    </label>
  );
};

export default Checkbox;

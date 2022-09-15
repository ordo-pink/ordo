import React from "react";
import { useTranslation } from "react-i18next";

import { Command as TCommand } from "@containers/app/types";
import { Accelerator } from "@modules/top-bar/components/accelerator";
import { useAppDispatch } from "@core/state/store";
import { useIcon } from "@core/hooks/use-icon";

type CommandProps = TCommand & {
  selected: number;
  index: number;
  setSelected: React.Dispatch<React.SetStateAction<number>>;
};

export const Command: React.FC<CommandProps> = ({ icon, name, accelerator, event, selected, index, setSelected }) => {
  const dispatch = useAppDispatch();

  const Icon = useIcon(icon as any);
  const [isSelected, setIsSelected] = React.useState<boolean>(false);

  const { t } = useTranslation();

  React.useEffect(() => {
    setIsSelected(selected === index);
  }, [selected, index]);

  const handleMouseOver = () => setSelected(index);
  const handleClick = () => dispatch({ type: "@top-bar/run-command", payload: event });

  return (
    <div
      className={`top-bar_item ${isSelected && "top-bar_item_selected"}`}
      onMouseOver={handleMouseOver}
      onClick={handleClick}
    >
      <div className="top-bar_item_info">
        <Icon className="top-bar_item_info_icon" />
        <div>{t(name)}</div>
      </div>
      <Accelerator accelerator={accelerator} />
    </div>
  );
};

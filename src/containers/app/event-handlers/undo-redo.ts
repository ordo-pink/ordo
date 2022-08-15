import { OrdoEventHandler } from "@core/types";

export const handleUndo: OrdoEventHandler<"@app/undo"> = ({ transmission }) => {
  transmission.undo();
};

export const handleRedo: OrdoEventHandler<"@app/redo"> = ({ transmission }) => {
  transmission.redo();
};

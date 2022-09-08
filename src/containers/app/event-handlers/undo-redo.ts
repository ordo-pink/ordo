import { OrdoEventHandler } from "@core/types";

/**
 * Trigger undoing previous undoable action.
 */
export const handleUndo: OrdoEventHandler<"@app/undo"> = ({ transmission }) => {
  transmission.undo();
};

/**
 * Trigger redoing previously undone undoable action.
 */
export const handleRedo: OrdoEventHandler<"@app/redo"> = ({ transmission }) => {
  transmission.redo();
};

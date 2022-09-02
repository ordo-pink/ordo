import { OrdoEventHandler } from "@core/types";

export const handlePaste: OrdoEventHandler<"@editor/paste"> = ({ context, transmission }) => {
  const clipboardContent = context.fromClipboard();
  const path = transmission.select((state) => state.editor.currentTab);

  const typeEvent = {
    ctrlKey: false,
    altKey: false,
    metaKey: false,
    shiftKey: false,
    key: clipboardContent.replace(/\n/g, " "),
  };

  transmission.emit("@editor/handle-typing", {
    path,
    event: typeEvent,
  });
};

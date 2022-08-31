import React from "react";
import { Draggable } from "react-beautiful-dnd";

import { useIcon } from "@core/hooks/use-icon";
import { OrdoFile } from "@modules/file-explorer/types";
import { Either } from "or-else";
import { tapPreventDefault, tapStopPropagation } from "@utils/events";
import { useAppDispatch, useAppSelector } from "@core/state/store";
import { Task as TTask } from "../types";
import { fromBoolean } from "@utils/either";
import { getFolderOrParent } from "@modules/file-explorer/utils/get-folder-or-parent";

type Props = {
  task: TTask;
  index: number;
  displayProperties: string[];
};

export const Task: React.FC<Props> = ({ task, displayProperties, index }) => {
  const dispatch = useAppDispatch();

  const tree = useAppSelector((state) => state.fileExplorer.tree);

  const titleInputRef = React.useRef<HTMLInputElement>(null);
  const [isTitleEditable, setIsTitleEditable] = React.useState<boolean>(false);
  const [cardTitleInputValue, setCardTitleInputValue] = React.useState<string>(task.readableName);

  const LinkIcon = useIcon("HiOutlineLink");
  const ShareIcon = useIcon("HiOutlineShare");
  const XIcon = useIcon("HiX");
  const PencilIcon = useIcon("HiOutlinePencilAlt");
  const CheckIcon = useIcon("HiOutlineCheckCircle");

  React.useEffect(() => {
    if (isTitleEditable && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isTitleEditable, titleInputRef.current]);

  const handleLinkClick = (e: React.MouseEvent) =>
    Either.of(e)
      .map(tapPreventDefault)
      .map(tapStopPropagation)
      .map(() =>
        dispatch({
          type: "@editor/open-tab",
          payload: task.path,
        }),
      );

  const handleRemoveClick = (e: React.MouseEvent) =>
    Either.of(e)
      .map(tapPreventDefault)
      .map(tapStopPropagation)
      .map(() =>
        dispatch({
          type: "@file-explorer/remove-file",
          payload: task.path,
        }),
      );

  const handleTitleInputFocus = () => dispatch({ type: "@editor/unfocus" });

  const handleTitleInputBlur = () => {
    setIsTitleEditable(false);
    setCardTitleInputValue(task.readableName);
  };

  const handleEditClick = () => {
    setIsTitleEditable((editable) => !editable);
  };
  const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setCardTitleInputValue(e.target.value);

  const handleTitleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      titleInputRef.current && titleInputRef.current.blur();
    } else if (e.key === "Enter") {
      setIsTitleEditable(false);
      const parent = getFolderOrParent(tree, task.path);

      parent &&
        dispatch({
          type: "@file-explorer/move",
          payload: {
            oldPath: task.path,
            newFolder: parent.path,
            name: cardTitleInputValue,
          },
        });
    }
  };

  return (
    <Draggable draggableId={task.path} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-2 bg-gradient-to-br rounded-lg whitespace-pre-wrap flex space-x-1 shadow-md transition-colors duration-300 ${
            snapshot.isDragging
              ? "from-stone-100 dark:from-stone-700 to-stone-200 dark:to-stone-800"
              : "from-neutral-50 dark:from-neutral-700 to-neutral-100 dark:to-neutral-800"
          }`}
        >
          <div className="flex flex-col space-y-2 flex-grow">
            {fromBoolean(isTitleEditable).fold(
              () => (
                <div>{task.readableName}</div>
              ),
              () => (
                <input
                  ref={titleInputRef}
                  className="rounded bg-transparent border-0 p-0"
                  type="text"
                  value={cardTitleInputValue}
                  onChange={handleTitleInputChange}
                  onFocus={handleTitleInputFocus}
                  onBlur={handleTitleInputBlur}
                  onKeyDown={handleTitleInputKeyDown}
                />
              ),
            )}
            <div className="flex space-x-2">
              {displayProperties.includes("links") &&
                task.frontmatter &&
                task.frontmatter.links &&
                task.frontmatter.links.length > 0 && (
                  <div className="text-sm">
                    <div className="flex space-x-1 items-center text-neutral-500 dark:text-neutral-400">
                      <ShareIcon />
                      <div>{task.frontmatter!.links.length}</div>
                    </div>
                  </div>
                )}
              {displayProperties.includes("todos") &&
                task.frontmatter &&
                task.frontmatter.todos &&
                (task.frontmatter.todos.pending || task.frontmatter.todos.done) &&
                (task.frontmatter.todos.pending.length > 0 || task.frontmatter.todos.done.length > 0) && (
                  <div className="text-sm">
                    <div
                      className={`flex space-x-1 items-center ${
                        task.frontmatter.todos.pending.length === 0
                          ? "text-emerald-500 dark:text-emerald-500 font-bold"
                          : "text-neutral-500 dark:text-neutral-400"
                      }`}
                    >
                      <CheckIcon />
                      <div>
                        {task.frontmatter.todos.done.length}/
                        {task.frontmatter.todos.done.length + task.frontmatter.todos.pending.length}
                      </div>
                    </div>
                  </div>
                )}
              {displayProperties.includes("tags") && task.frontmatter && (
                <div className="text-sm">
                  <div className="flex flex-wrap space-x-1 text-neutral-500 dark:text-neutral-400">
                    {task.frontmatter.tags &&
                      task.frontmatter.tags.map((tag: string) => (
                        <div
                          className="font-bold bg-gradient-to-tr from-orange-600 dark:from-purple-400 to-pink-700 dark:to-pink-400 text-transparent bg-clip-text drop-shadow-xl"
                          key={tag}
                        >
                          #{tag}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-1 flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <button onClick={handleLinkClick}>
                  <LinkIcon
                    title={`Open "${task.readableName}" in a new tab`}
                    className="text-neutral-500 hover:text-rose-500 transition-colors duration-300 cursor-pointer"
                  />
                </button>
                <button onClick={handleEditClick}>
                  <PencilIcon
                    title="Edit card title"
                    className="text-neutral-500 hover:text-rose-500 transition-colors duration-300 cursor-pointer"
                  />
                </button>
              </div>
              <button onClick={handleRemoveClick}>
                <XIcon
                  title="Remove card"
                  className="text-neutral-500 hover:text-rose-500 transition-colors duration-300 cursor-pointer"
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

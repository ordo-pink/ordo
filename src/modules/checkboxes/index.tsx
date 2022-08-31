import { useIcon } from "@core/hooks/use-icon";
import { useAppDispatch, useAppSelector } from "@core/state/store";
import { collectFiles } from "@modules/file-explorer/utils/collect-files";
import { getDocumentName } from "@utils/get-document-name";
import { NoOp } from "@utils/no-op";
import { Either } from "or-else";
import React from "react";

export const Checkboxes = () => {
  const dispatch = useAppDispatch();

  const tree = useAppSelector((state) => state.fileExplorer.tree);
  const LinkIcon = useIcon("HiOutlineLink");

  return Either.fromNullable(tree)
    .map(collectFiles)
    .fold(NoOp, (fs) => (
      <div className="flex flex-col space-y-2 select-none p-2 overflow-y-auto h-[calc(100vh-3.75rem)]">
        {fs.map((f) =>
          Either.fromNullable(f)
            .chain((f) => Either.fromNullable(f.frontmatter).chain((fm) => Either.fromNullable(fm.todos)))
            .fold(
              NoOp,
              (todos) =>
                (todos.pending.length > 0 || todos.done.length > 0) && (
                  <div key={f.path}>
                    <div className="flex space-x-1 items-center">
                      <h2 className="font-bold text-xl my-2">{getDocumentName(f.readableName)}</h2>
                      <button onClick={() => dispatch({ type: "@editor/open-tab", payload: f.path })}>
                        <LinkIcon className={`cursor-pointer ${"text-sky-800 dark:text-sky-400"}`} />
                      </button>
                    </div>
                    {todos.pending.map((p: string) => (
                      <div className="flex space-x-2 items-center" key={`${f.path}-${p}`}>
                        <input
                          type="checkbox"
                          className="block w-5 h-5 text-green-700"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onChange={() =>
                            dispatch({
                              type: "@file-explorer/replace-line",
                              payload: {
                                oldContent: `[ ] ${p}`,
                                newContent: `[x] ${p}`,
                                path: f.path,
                              },
                            })
                          }
                        />
                        <div>{p}</div>
                      </div>
                    ))}
                    {todos.done.map((p: string) => (
                      <div className="flex space-x-2 items-center" key={`${f.path}-${p}`}>
                        <input
                          type="checkbox"
                          className="block w-5 h-5 text-green-700"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onChange={() =>
                            dispatch({
                              type: "@file-explorer/replace-line",
                              payload: {
                                oldContent: `[x] ${p}`,
                                newContent: `[ ] ${p}`,
                                path: f.path,
                              },
                            })
                          }
                          checked
                        />
                        <div className="line-through">{p}</div>
                      </div>
                    ))}
                  </div>
                ),
            ),
        )}
      </div>
    ));
};

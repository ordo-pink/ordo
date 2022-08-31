import { useAppDispatch, useAppSelector } from "@core/state/store";
import { OrdoFile } from "@modules/file-explorer/types";
import { collectFiles } from "@modules/file-explorer/utils/collect-files";
import { CollectedTag, collectTags } from "@modules/file-explorer/utils/collect-tags";
import Fuse from "fuse.js";
import React from "react";
import { useCurrentTab } from "../hooks/use-current-tab";
import { EditorTab } from "../types";

const getCurrentLineChar = (tab: EditorTab, offset = 0) =>
  tab?.content.children[tab?.caretPositions[0].start.line - 1].raw[tab?.caretPositions[0].start.character + offset];

const charEquals = (what: string) => (which: string) => what === which;

export const Autocomplete: React.FC<{ char: string }> = ({ char }) => {
  const dispatch = useAppDispatch();

  const tree = useAppSelector((state) => state.fileExplorer.tree);

  const [show, setShow] = React.useState<boolean>(false);
  const [links, setLinks] = React.useState<OrdoFile[]>([]);
  const [tags, setTags] = React.useState<CollectedTag[]>([]);
  const [fusedLinks, setFusedLinks] = React.useState(links.map((item) => ({ item })));
  const [fusedTags, setFusedTags] = React.useState(tags.map((item) => ({ item })));

  const { tab } = useCurrentTab();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const linksFuse = React.useRef(new Fuse(links, { keys: ["readableName", "relativePath"] }));
  const tagsFuse = React.useRef(new Fuse(tags, { keys: ["name", "files.readableName", "files.relativePath"] }));

  React.useEffect(() => {
    linksFuse.current.setCollection(links);
    setFusedLinks(links.map((item) => ({ item })));
  }, [links]);
  React.useEffect(() => {
    tagsFuse.current.setCollection(tags);
    setFusedTags(tags.map((item) => ({ item })));
  }, [tags]);

  React.useEffect(() => dispatch({ type: show ? "@editor/unfocus" : "@editor/focus" }), [show]);

  React.useEffect(() => {
    if (!tab) return void setShow(false);

    const multipleCaretsUsed = tab.caretPositions.length > 1;
    const charSelectionExists = tab.caretPositions[0].start.character !== tab.caretPositions[0].end.character;
    const lineSelectionExists = tab.caretPositions[0].start.line !== tab.caretPositions[0].end.line;
    const noPreviousChars = tab.caretPositions[0].start.character === 0;

    if (multipleCaretsUsed || charSelectionExists || lineSelectionExists || noPreviousChars) return void setShow(false);

    const currentChar = getCurrentLineChar(tab);
    const previousChar = getCurrentLineChar(tab, -1);
    const previousPreviousChar = getCurrentLineChar(tab, -2);

    const isHash = charEquals("#");
    const isWhitespace = charEquals(" ");
    const isOpeningSuareBracket = charEquals("[");

    // This also tries to avoid showing the popup when you touch hashes in headings
    if (isHash(previousChar) && !isWhitespace(currentChar) && !isHash(currentChar)) {
      const tags = collectTags(tree);

      setLinks([]);
      setTags(tags);

      return void setShow(true);
    }

    if (
      isOpeningSuareBracket(previousPreviousChar) &&
      isOpeningSuareBracket(previousChar) &&
      !isWhitespace(currentChar)
    ) {
      const files = collectFiles(tree);

      setTags([]);
      setLinks(files);

      return void setShow(true);
    }

    setShow(false);
  }, [tab]);

  const updateLinkList = (search: string) =>
    setFusedLinks(search.length ? linksFuse.current.search(search) : links.map((item) => ({ item })));

  const updateTagList = (search: string) =>
    setFusedTags(search.length ? tagsFuse.current.search(search) : tags.map((item) => ({ item })));

  const handleItemClick = (e: React.MouseEvent, item: string) => {
    if (!tab) return;

    e.preventDefault();
    e.stopPropagation();

    dispatch({ type: "@editor/focus" });

    dispatch({
      type: "@editor/handle-typing",
      payload: {
        path: tab.path,
        event: {
          altKey: false,
          shiftKey: false,
          ctrlKey: false,
          metaKey: false,
          key: fusedLinks.length ? `${item}]] ` : `${item} `,
        },
      },
    });
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch({ type: "@editor/unfocus" });
  };

  const handleInputKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!tab) return;

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      dispatch({ type: "@editor/focus" });
      setShow(false);
      setLinks([]);
      setTags([]);
    } else if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      dispatch({ type: "@editor/focus" });

      dispatch({
        type: "@editor/handle-typing",
        payload: {
          path: tab.path,
          event: {
            altKey: false,
            shiftKey: false,
            ctrlKey: false,
            metaKey: false,
            key: fusedLinks.length ? `${e.currentTarget.value}]] ` : `${e.currentTarget.value} `,
          },
        },
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    fusedLinks.length ? updateLinkList(e.target.value) : updateTagList(e.target.value);
  };

  return show ? (
    <div className="absolute bottom-[-1px] left-0 bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-normal">
      {(fusedLinks.length ? fusedLinks : fusedTags).slice(0, 5).map(({ item }: any) => (
        <p
          title={item.readableName ? item.readablОрeName : item.name}
          key={item.path ? item.path : item.name}
          className="hover:bg-neutral-300 dark:bg-neutral-900 px-2 cursor-pointer max-w-full w-80 truncate"
          onClick={(e) => handleItemClick(e, item.readableName ? item.readableName : item.name)}
        >
          {item.readableName ? item.readableName : item.name}
        </p>
      ))}
      <input
        ref={inputRef}
        type="text"
        className="outline-0 w-80 p-0 m-0 border-0 bg-neutral-100"
        autoFocus={show}
        onClick={handleInputClick}
        onKeyDown={handleInputKeydown}
        onChange={handleInputChange}
      />
    </div>
  ) : null;
};

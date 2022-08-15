import { NodeWithChildren } from "@core/parser/types";
import { OrdoEventHandler } from "@core/types";
import { findOrdoFile } from "@modules/file-explorer/utils/find-ordo-file";
import { parseLine } from "@modules/text-parser";

export const handleToggleToDo: OrdoEventHandler<"@editor/toggle-todo"> = async ({ draft, payload, transmission }) => {
  const { currentTab, tabs } = draft.editor;
  const tab = tabs.find((t) => t.path === currentTab);

  if (!tab) return;

  const file = findOrdoFile(draft.fileExplorer.tree, "path", tab.path);

  if (!file) return;

  const line = tab.content.children[payload] as NodeWithChildren;
  const checked = line.raw.charAt(1) === "x";

  const check = (str: string) => str.replace("[ ] ", "[x] ");
  const uncheck = (str: string) => str.replace("[x] ", "[ ] ");

  if (checked) {
    line.raw = uncheck(line.raw);
    file.frontmatter!.todos.done.splice(file.frontmatter!.todos.done.indexOf(line.raw.slice(4)), 1);
    file.frontmatter!.todos.pending.push(line.raw.slice(4));
  } else {
    line.raw = check(line.raw);
    file.frontmatter!.todos.pending.splice(file.frontmatter!.todos.pending.indexOf(line.raw.slice(4)), 1);
    file.frontmatter!.todos.done.push(line.raw.slice(4));
  }

  tab.content.children[payload] = parseLine(line.raw, payload, tab.content, {
    depth: tab.content.depth,
  });

  tab.content.raw = tab.content.children.map((line) => line.raw).join("\n");

  await transmission.emit("@file-explorer/save-file", { path: tab.path, content: tab.content.raw });
};

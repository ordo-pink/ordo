import { OrdoFile } from "@modules/file-explorer/types";
import { EditorTab } from "@modules/editor/types";
import { visit } from "./collect-metadata";

export const collectFrontmatterValues = (file: OrdoFile, tab: EditorTab) => {
  const { tags, embeds, links, todos } = visit(tab.content);

  if (!file.frontmatter) {
    file.frontmatter = {};
  }

  file.frontmatter.tags = tags;
  file.frontmatter.embeds = embeds;
  file.frontmatter.links = links;
  file.frontmatter.todos = todos;

  tab.content.data.frontmatter = file.frontmatter;
};

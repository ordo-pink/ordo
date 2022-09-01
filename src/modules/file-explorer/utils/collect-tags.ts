import { OrdoFile, OrdoFolder } from "@modules/file-explorer/types";
import { isFolder } from "@modules/file-explorer/utils/is-folder";

export type CollectedTag = {
  name: string;
  timesUsed: number;
  files: OrdoFile[];
};

export const collectTags = (tree: OrdoFolder, tags: CollectedTag[] = []): CollectedTag[] => {
  tree.children.forEach((child) => {
    if (isFolder(child)) {
      collectTags(child, tags);
    } else {
      if (child.frontmatter && child.frontmatter.tags) {
        child.frontmatter.tags.forEach((tag: string) => {
          const t = tags.find((t) => t.name === tag);

          if (!t) {
            tags.push({
              name: tag,
              timesUsed: 1,
              files: [child],
            });
          } else {
            t.timesUsed++;
            t.files.push(child);
          }
        });
      }
    }
  });

  return tags;
};

import { sep } from "path";
import { randomUUID } from "crypto";

import { userSettingsStore } from "@core/settings/user-settings";
import { OrdoFile } from "@modules/file-explorer/types";

// TODO: Move to frontend
const toReadableSize = (a: number, b = 2, k = 1024): string => {
  const d = Math.floor(Math.log(a) / Math.log(k));
  return 0 == a
    ? "0 Bytes"
    : `${parseFloat((a / Math.pow(k, d)).toFixed(Math.max(0, b)))}${
        ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
      }`;
};

interface CreateOrdoFileArg {
  path: string;
  size?: number;
  depth?: number;
  uuid?: string;
  createdAt?: Date;
  updatedAt?: Date;
  accessedAt?: Date;
  relativePath: string;
}

export const createOrdoFile = ({
  depth = 0,
  createdAt = new Date(),
  updatedAt = new Date(),
  accessedAt = new Date(),
  path,
  uuid,
  relativePath,
  size = 0,
}: CreateOrdoFileArg): OrdoFile => {
  const readableName = path.substring(path.lastIndexOf(sep) + 1);
  const extension = readableName.substring(readableName.lastIndexOf("."));

  const associations = userSettingsStore.store.explorer.associations;
  const association = associations.find((a) => a.extension === extension);

  const type = association ? association.association : "file";
  const readableSize = toReadableSize(size);

  return {
    uuid: uuid ? uuid : randomUUID(),
    depth,
    createdAt,
    updatedAt,
    accessedAt,
    path,
    size,
    readableName,
    relativePath,
    extension,
    readableSize,
    type: type as any,
    frontmatter: null,
  };
};

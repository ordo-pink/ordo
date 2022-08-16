import { sep } from "path";
import { randomUUID } from "crypto";

import { OrdoFolder } from "@modules/file-explorer/types";

type CreateOrdoFolderArg = {
  path: string;
  depth?: number;
  createdAt?: Date;
  updatedAt?: Date;
  accessedAt?: Date;
  uuid?: string;
  collapsed?: boolean;
  relativePath: string;
};

export const createOrdoFolder = ({
  depth = 0,
  createdAt = new Date(),
  updatedAt = new Date(),
  accessedAt = new Date(),
  path,
  uuid,
  collapsed = true,
  relativePath,
}: CreateOrdoFolderArg): OrdoFolder => {
  const splittablePath = path.endsWith(sep) ? path.slice(0, -1) : path;
  const readableName = splittablePath.slice(splittablePath.lastIndexOf(sep) + 1);

  return {
    uuid: uuid ? uuid : randomUUID(),
    path,
    relativePath,
    readableName,
    depth,
    createdAt,
    updatedAt,
    accessedAt,
    collapsed,
    type: "folder",
    children: [],
    color: "neutral",
  };
};

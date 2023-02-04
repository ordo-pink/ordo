import { reduce } from "ramda"
import { useMemo } from "react";

import { useTranslation } from "react-i18next";
import { isOrdoDirectory } from "$core/guards/is-fs-entity"
import { useAppSelector } from "$core/state/hooks/use-app-selector";
import { OrdoDirectory, OrdoFile, Nullable } from "$core/types";
import { Either } from "$core/utils/either";
import { convertBytesToMb } from "$core/utils/size-format-helper";

import '../index.css'

const spaceLimitMB = Number(process.env.REACT_USER_SPACE_LIMIT || 50);

const sizeReducer = (totalSize: number) => (acc: number, item: OrdoFile | OrdoDirectory) =>
  isOrdoDirectory (item)
    ? acc + calculateTreeSize (item, totalSize)
    : acc + item.size

export const calculateTreeSize = (directory: Nullable<OrdoDirectory>, size = 0): number =>
  Either.fromNullable(directory)
    .chain((dir) => Either.fromNullable(dir.children))
    .map(reduce(sizeReducer(size), size))
    .fold(
      () => 0,
      (size) => size,
    )

const UsedSpace = () => {

  const directory = useAppSelector((state) => state.app.personalProject)

  const { t } = useTranslation()

  const usedSpaceText = t("@ordo-activity-user/used-space")

  const allFilesSizeMB = useMemo(
    () => convertBytesToMb(calculateTreeSize(directory, 0)),
    [directory]
  )
  const usedSpacePercent = (allFilesSizeMB / spaceLimitMB) * 100;

  return (
    <>
      <div className="flex justify-between mb-1 ">
        <span className="text-base font-medium text-blue-700 dark:text-white">
          {usedSpaceText}
        </span>
        <span className="text-sm font-medium text-blue-700 dark:text-white">
          {/* eslint-disable-next-line i18next/no-literal-string */}
          {allFilesSizeMB}/{spaceLimitMB}MB
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-3">
        <div
          className="bg-gradient-to-r from-pink-700 dark:from-pink-500 to-purple-600 dark:to-purple-400 h-2.5 rounded-full"
          style={{width: `${usedSpacePercent.toFixed(0)}%`}}
        />
      </div>
    </>
  )
}

export {
  UsedSpace,
}
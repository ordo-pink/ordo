import { IOrdoDirectory, Nullable, OrdoDirectoryPath } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import {
  ActionListItem,
  DirectoryIcon,
  IconSize,
  Null,
  OrdoButtonSuccess,
  useCommands,
  useContextMenu,
  useDrive,
  useRouteParams,
} from "@ordo-pink/react-utils"
import { MouseEvent, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { BsDeviceHdd, BsPlus, BsTrash3 } from "react-icons/bs"

export default function FSActivitySidebar() {
  const { path } = useRouteParams()
  const drive = useDrive()
  const { showContextMenu } = useContextMenu()
  const { t } = useTranslation("fs")
  const { emit } = useCommands()

  const [currentDirectory, setCurrentDirectory] = useState<Nullable<IOrdoDirectory>>(null)
  const [favourites, setFavourites] = useState<IOrdoDirectory[]>([])

  useEffect(() => {
    if (!drive) return setCurrentDirectory(null)

    setFavourites(
      OrdoDirectory.getDirectoriesDeep(drive.root)
        .filter((item) => item.metadata.isFavourite)
        .sort((a, b) => a.readableName.localeCompare(b.readableName)),
    )

    if (!path) return setCurrentDirectory(drive.root)

    setCurrentDirectory(
      path
        ? OrdoDirectory.findDirectoryDeep(`/${path}` as OrdoDirectoryPath, drive.root)
        : drive.root,
    )
  }, [drive, path])

  const tCreateButton = t("create-button")
  const tRoot = t("root")
  // const tShared = t("shared-directories")
  const tLocations = t("locations")
  const tRecent = t("recent")
  const tFavourites = t("favourites")
  // const tDevices = t("devices")
  const tTrash = t("trash")

  const handleCreateClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (!drive) return

    showContextMenu({
      x: event.pageX,
      y: event.pageY,
      target: currentDirectory,
      hideDeleteCommands: true,
      hideReadCommands: true,
      hideUpdateCommands: true,
    })
  }

  // TODO: Adding to favourites via CommandPalette
  // TODO: Opening FS in CommandPalette
  // TODO: Reveal in File Explorer command
  // TODO: Path breadcrumbs
  return Either.fromNullable(currentDirectory).fold(Null, (directory) => (
    <div className="flex flex-col space-y-8 px-2 py-8 items-start">
      <OrdoButtonSuccess onClick={handleCreateClick}>
        <div className="flex items-center space-x-2">
          <BsPlus />
          <div>{tCreateButton}</div>
        </div>
      </OrdoButtonSuccess>

      <div className="flex flex-col w-full">
        <h2 className="mb-4 uppercase text-neutral-500 font-bold text-sm text-center">
          {tLocations}
        </h2>

        <ActionListItem
          isLarge
          isCurrent={directory.path === "/"}
          Icon={BsDeviceHdd}
          text={tRoot}
          onClick={() => emit("router.navigate", "/fs")}
        />

        {/* <ActionListItem
          isLarge
          isCurrent={directory.path === "/__internal__/devices/"}
          Icon={BsLaptop}
          text={tDevices}
          onClick={() => emit("router.navigate", "/fs")}
        />

        <ActionListItem
          isLarge
          isCurrent={directory.path === "/__internal__/shared/"}
          Icon={BsFolderSymlink}
          text={tShared}
          onClick={() => emit("router.navigate", "/fs")}
        /> */}

        <ActionListItem
          isLarge
          isCurrent={directory.path === "/.trash/"}
          Icon={BsTrash3}
          text={tTrash}
          onClick={() => emit("router.navigate", "/fs/.trash/")}
        />
      </div>

      {Either.fromBoolean(favourites.length > 0)
        .map(() => favourites)
        .fold(Null, (favs) => (
          <div className="flex flex-col w-full">
            <h2 className="mb-4 uppercase text-neutral-500 font-bold text-sm text-center">
              {tFavourites}
            </h2>

            {favs.map((favourite) => (
              <ActionListItem
                key={favourite.path}
                isCurrent={directory.path === favourite.path}
                text={favourite.readableName}
                Icon={() => (
                  <DirectoryIcon
                    directory={favourite}
                    size={IconSize.EXTRA_SMALL}
                  />
                )}
                onContextMenu={(event) => {
                  event.preventDefault()
                  event.stopPropagation()

                  showContextMenu({
                    x: event.pageX,
                    y: event.pageY,
                    target: favourite,
                  })
                }}
                onClick={() => emit("router.navigate", `/fs${favourite.path}`)}
              />
            ))}
          </div>
        ))}

      <div className="flex flex-col w-full">
        <h2 className="mb-4 uppercase text-neutral-500 font-bold text-sm text-center">{tRecent}</h2>
      </div>
    </div>
  ))
}

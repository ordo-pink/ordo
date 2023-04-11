import { IOrdoDirectory, Nullable, OrdoDirectoryPath } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import {
  ActionListItem,
  Null,
  OrdoButtonSuccess,
  useCommands,
  useContextMenu,
  useDrive,
  useRouteParams,
} from "@ordo-pink/react-utils"
import { MouseEvent, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { BsDeviceHdd, BsPlus } from "react-icons/bs"

export default function FSActivitySidebar() {
  const { path } = useRouteParams()
  const drive = useDrive()
  const { showContextMenu } = useContextMenu()
  const { t } = useTranslation("fs")
  const { emit } = useCommands()

  const [currentDirectory, setCurrentDirectory] = useState<Nullable<IOrdoDirectory>>(null)

  useEffect(() => {
    if (!drive) return setCurrentDirectory(null)
    if (!path) return setCurrentDirectory(drive.root)

    setCurrentDirectory(
      path
        ? OrdoDirectory.findDirectoryDeep(`/${path}` as OrdoDirectoryPath, drive.root)
        : drive.root,
    )
  }, [drive, path])

  const tCreateButton = t("create-button")
  const tRoot = t("root")
  const tLocations = t("locations")
  const tRecent = t("recent")
  const tFavourites = t("favourites")

  const handleCreateClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (!drive) return

    showContextMenu({
      x: event.pageX,
      y: event.pageY,
      target: currentDirectory,
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

      <div className="flex flex-col space-y-1 w-full">
        <h2 className="uppercase text-neutral-500 font-bold text-sm text-center">{tLocations}</h2>
        {/* {directory && directory.path !== "/" ? (
          <ActionListItem
            isLarge
            isCurrent
            Icon={BsFolder2Open}
            text={directory.readableName}
          />
        ) : null} */}

        <ActionListItem
          isLarge
          isCurrent={directory.path === "/"}
          Icon={BsDeviceHdd}
          text={tRoot}
          onClick={() => emit("router.navigate", "/fs")}
        />
      </div>

      <div className="flex flex-col space-y-1 w-full">
        <h2 className="uppercase text-neutral-500 font-bold text-sm text-center">{tFavourites}</h2>
      </div>

      <div className="flex flex-col space-y-1 w-full">
        <h2 className="uppercase text-neutral-500 font-bold text-sm text-center">{tRecent}</h2>
      </div>
    </div>
  ))
}

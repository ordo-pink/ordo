import { PropsWithChildren } from "react"
import { BsChevronRight, BsChevronLeft } from "react-icons/bs"

import { toggleSidebarVisibility } from "$containers/app/store"

import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { Either } from "$core/utils/either"

export default function Sidebar({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch()

  const isVisible = useAppSelector((state) => state.app.isSidebarVisible)

  const toggleVisibility = () => dispatch(toggleSidebarVisibility())

  return Either.fromBoolean(isVisible).fold(
    () => (
      <div className="h-screen ml-[-1rem] flex flex-col justify-center cursor-pointer">
        <BsChevronRight onClick={toggleVisibility} />
      </div>
    ),
    () => (
      <>
        <div className="workspace-sidebar">{children}</div>
        <div className="h-screen ml-[-1rem] flex flex-col justify-center cursor-pointer">
          <BsChevronLeft onClick={toggleVisibility} />
        </div>
      </>
    ),
  )
}

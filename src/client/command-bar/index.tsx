import React from "react"

import Either from "@core/utils/either"

import Null from "@client/null"

export default function CommandBar() {
  // const [isShown, setIsShown] = useState(false)
  const isShown = true

  return Either.fromBoolean(isShown).fold(Null, () => (
    <div className="fixed left-0 top-0 right-0 bottom-0 bg-neutral-500 bg-opacity-50 flex justify-center items-start p-48 nav-bar">
      <input type="search" className="w-96 border border-neutral-600 px-2" placeholder="Search" />
    </div>
  ))
}

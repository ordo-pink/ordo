import React from "react"

import { useIcon } from "@client/common/hooks/use-icon"

export default function IsLoadingStep() {
  const RotateIcon = useIcon("AiOutlineLoading")

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <RotateIcon className="text-5xl animate-spin text-pink-500" />
    </div>
  )
}

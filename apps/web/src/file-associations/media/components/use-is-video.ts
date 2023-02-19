import { Nullable } from "@ordo-pink/common-types"
import { useState, useLayoutEffect } from "react"

export const useIsVideo = (content: string) => {
  const [isVideo, setIsVideo] = useState(false)

  useLayoutEffect(() => {
    let video: Nullable<HTMLVideoElement> = document.createElement("video")

    video.preload = "metadata"

    video.onloadedmetadata = () => {
      setIsVideo(Boolean(video && video.videoHeight && video.videoWidth))

      if (video) {
        video.src = null as unknown as string
        video = null
      }
    }

    video.src = content
  }, [content])

  return isVideo
}

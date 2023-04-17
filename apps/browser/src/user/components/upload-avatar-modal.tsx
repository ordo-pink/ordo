import { Nullable, ThunkFn } from "@ordo-pink/common-types"
import { OrdoFile } from "@ordo-pink/fs-entity"
import {
  OrdoButtonPrimary,
  OrdoButtonSecondary,
  useCommands,
  useDebounceEffect,
  useFsDriver,
  useModal,
} from "@ordo-pink/react-utils"
import { ChangeEvent, SyntheticEvent, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { BsFileEarmarkPlus } from "react-icons/bs"
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from "react-image-crop"
import { canvasPreview } from "../utils/canvas-preview"

import "react-image-crop/dist/ReactCrop.css"

type Props = {
  onAvatarChanged?: ThunkFn<void>
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 50,
      },
      1,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export default function UploadAvatarModal({ onAvatarChanged }: Props) {
  const { hideModal } = useModal()
  const driver = useFsDriver()
  const { emit } = useCommands()
  const { t } = useTranslation("ordo")

  const [imgSrc, setImgSrc] = useState("")
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const blobUrlRef = useRef("")
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()

  const [userAvatar, setUserAvatar] = useState<Nullable<string>>(null)

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop)
      }
    },
    100,
    [completedCrop],
  )

  useEffect(() => {
    if (!driver) return

    driver.files.getContent("/.avatar.png").then((res) => {
      if (!res.ok) return

      res.blob().then((blob) => {
        setUserAvatar(URL.createObjectURL(blob))
      })
    })

    return () => {
      if (userAvatar) {
        URL.revokeObjectURL(userAvatar)
        setUserAvatar(null)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driver])

  const tTitle = t("upload-avatar")
  const tCancel = t("cancel-button")
  const tUpload = t("upload-avatar")

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined) // Makes crop preview update between images.
      const reader = new FileReader()
      reader.addEventListener("load", () => setImgSrc(reader.result?.toString() || ""))
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const handleImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height))
  }

  const handleOkButtonClick = () => {
    previewCanvasRef.current &&
      previewCanvasRef.current.toBlob(async (blob) => {
        if (!blob) {
          throw new Error("Failed to create blob")
        }

        if (blobUrlRef.current) {
          URL.revokeObjectURL(blobUrlRef.current)
        }
        blobUrlRef.current = URL.createObjectURL(blob)

        const path = "/.avatar.png"
        const avatar = OrdoFile.empty(path)

        const command = userAvatar ? "fs.update-file-content" : "fs.create-file"

        emit(command, {
          file: avatar,
          content: await blob.arrayBuffer(),
        })

        onAvatarChanged && onAvatarChanged()

        hideModal()
      })
  }

  return (
    <div className="relative w-[30rem] max-w-full flex flex-col gap-8">
      <div className="flex space-x-2 px-8 pt-8 items-center">
        <div className="bg-gradient-to-tr from-slate-400 dark:from-slate-600 to-zinc-400 dark:to-zinc-600 rounded-full text-xl text-neutral-200 p-3 shadow-md">
          <BsFileEarmarkPlus />
        </div>
        <div className="grow flex flex-col gap-y-4">
          <h3 className="px-8 text-lg font-bold">{tTitle}</h3>

          <div className="pl-8 block">
            <input
              type="file"
              className={`w-full outline-none border dark:border-0 border-neutral-400 rounded-lg bg-white dark:bg-neutral-600 px-4 py-2 ${
                imgSrc && "mb-8"
              }`}
              onChange={handleFileChange}
            />

            {!!imgSrc && (
              <ReactCrop
                crop={crop}
                className="rounded-lg mt-8 mb-16 mx-4"
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  onLoad={handleImageLoad}
                />
              </ReactCrop>
            )}

            {!!completedCrop && (
              <div className="-mt-32 flex justify-end absolute right-6">
                <canvas
                  ref={previewCanvasRef}
                  className="h-32 w-32 p-1 rounded-full bg-gradient-to-tr from-sky-400 via-purple-400 to-rose-400 shadow-lg shrink-0 cursor-pointer"
                  style={{
                    objectFit: "contain",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 px-8 pb-4 pt-4 bg-neutral-200/50 dark:bg-neutral-800/30 rounded-b-lg">
        <OrdoButtonSecondary
          hotkey="escape"
          onClick={hideModal}
        >
          {tCancel}
        </OrdoButtonSecondary>

        <OrdoButtonPrimary
          hotkey="enter"
          disabled={!previewCanvasRef.current}
          onClick={handleOkButtonClick}
        >
          {tUpload}
        </OrdoButtonPrimary>
      </div>
    </div>
  )
}

import { createFileAssociationExtension } from "$core/extensions/create-file-association-extension"
import { OrdoFileAssociationProps } from "$core/types"

const media = createFileAssociationExtension("media", {
  Component: () => import("$file-associations/media/components"),
  Icon: () => import("$file-associations/media/components/icon"),
  fileExtensions: [".wav", ".mp3", ".ogg", ".mp4", ".adts", ".webm", ".caf", ".flac"],
  readableName: "@ordo-file-association-media/title",
  translations: {
    ru: {
      "@ordo-file-association-media/title": "Поддержка медиа файлов",
    },
    en: {
      "@ordo-file-association-media/title": "media files support",
    },
  },
})

export type MediaProps = OrdoFileAssociationProps<typeof media>

export default media

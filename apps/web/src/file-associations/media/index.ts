import { createFileAssociationExtension, OrdoFileAssociationProps } from "@ordo-pink/extensions"

const media = createFileAssociationExtension("media", {
  Component: () => import("./components"),
  Icon: () => import("./components/icon"),
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

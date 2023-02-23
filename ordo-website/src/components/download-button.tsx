import React, { useEffect, useState } from "react"
import { DiApple, DiLinux, DiWindows } from "react-icons/di"
import { Link } from "gatsby"

const macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"]
const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"]

export const DownloadButton = () => {
  const [isDownloadable, setIsDownloadable] = useState(false)
  const [os, setOs] = useState("")
  const [link, setLink] = useState("")

  useEffect(() => {
    const userAgent = window.navigator.userAgent
    const platform = window.navigator.platform

    let canDownload = false
    let os = ""
    let downloadLink = ""

    const isMac = macosPlatforms.indexOf(platform) !== -1
    const isWindows = windowsPlatforms.indexOf(platform) !== -1
    const isLinux = !/Android/.test(userAgent) && /Linux/.test(platform)

    if (isMac) {
      canDownload = true
      os = "MacOS"
      downloadLink =
        "https://github.com/ordo-pink/ordo-electron/releases/download/0.2.0/ordo-0.2.0-darwin-x64.zip"
    } else if (isWindows) {
      canDownload = true
      os = "Windows"
      downloadLink =
        "https://github.com/ordo-pink/ordo-electron/releases/download/0.2.0/ordo-0.2.0-windows-x64.zip"
    } else if (isLinux) {
      canDownload = true
      os = "Linux (Deb)"
      downloadLink =
        "https://github.com/ordo-pink/ordo-electron/releases/download/0.2.0/ordo-0.2.0-linux-amd64.deb"
    }

    setOs(os)
    setLink(downloadLink)
    setIsDownloadable(canDownload)
  }, [])

  return isDownloadable ? (
    <>
      <a href={link} className="hero__link btn mb-2">
        Скачать для {os}
        {os === "MacOS" ? (
          <DiApple className="text-2xl" />
        ) : os === "Windows" ? (
          <DiWindows className="text-2xl" />
        ) : (
          <DiLinux className="text-2xl" />
        )}
      </a>
      <div className="text-sm text-neutral-500 py-2 px-16 underline">
        <Link to="/download">Другие варианты</Link>
      </div>
    </>
  ) : (
    <a href="#" className="hero__mobile-link mobile-link">
      Доступно для
      <DiApple className="text-2xl" />
      <DiWindows className="text-2xl" />
      <DiLinux className="text-2xl" />
    </a>
  )
}

import { Link } from "gatsby"
import React from "react"
import { DiWindows, DiLinux, DiApple } from "react-icons/di"
import { HiOutlineBookOpen } from "react-icons/hi"
import { Footer } from "../components/footer"
import { Header } from "../components/header"
import { Seo } from "../components/seo"

export default function PrivateBeta() {
  return (
    <div className="flex flex-col min-h-screen text-white mt-12">
      <Seo
        title="Скачать"
        description="Скачать Ordo для Windows, Linux и MacOS"
      />
      <Header />
      <div className="flex-grow flex flex-col items-center justify-center justify-self-center self-center my-8">
        <div className="py-8 text-center">
          <h1 className="text-4xl font-black max-w-xl">Скачать ORDO</h1>
          <h2 className="text-2xl max-w-xl">v0.1.1-ALPHA</h2>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <a
              href="https://github.com/ordo-pink/ordo-electron/releases/download/0.2.0/ordo-0.2.0-windows-x64.zip"
              className="flex space-x-2 justify-center items-center px-8 py-2 bg-gradient-to-tr from-pink-500 to-cyan-500 rounded-xl font-semibold text-xl text-white whitespace-nowrap"
            >
              <DiWindows />
              <div>Windows</div>
            </a>
          </div>
          <div className="flex flex-col space-y-2">
            <a
              href="https://github.com/ordo-pink/ordo-electron/releases/download/0.2.0/ordo-0.2.0-darwin-x64.zip"
              className="flex space-x-2 justify-center items-center px-8 py-2 bg-gradient-to-tr from-pink-500 to-cyan-500 rounded-xl font-semibold text-xl text-white whitespace-nowrap"
            >
              <DiApple />
              <div>MacOS</div>
            </a>
          </div>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex flex-col space-y-2">
              <a
                href="https://github.com/ordo-pink/ordo-electron/releases/download/0.2.0/ordo-0.2.0-linux-amd64.deb"
                className="flex space-x-2 justify-center items-center px-8 py-2 bg-gradient-to-tr from-pink-500 to-cyan-500 rounded-xl font-semibold text-xl text-white whitespace-nowrap"
              >
                <DiLinux />
                <div>Linux (RPM)</div>
              </a>
            </div>
            <div className="flex flex-col space-y-2">
              <a
                href="https://github.com/ordo-pink/ordo-electron/releases/download/0.2.0/ordo-0.2.0-linux-amd64.deb"
                className="flex space-x-2 justify-center items-center px-8 py-2 bg-gradient-to-tr from-pink-500 to-cyan-500 rounded-xl font-semibold text-xl text-white whitespace-nowrap"
              >
                <DiLinux />
                <div>Linux (DEB)</div>
              </a>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Link
              to="/blog/markdown-basics"
              className="flex space-x-2 justify-center items-center font-semibold px-2 py-1"
            >
              <HiOutlineBookOpen />
              <div>А как этим пользоваться?</div>
            </Link>
          </div>
        </div>

        <div className="mt-12 bg-red-800 w-72 p-4 rounded-lg">
          <p className="uppercase mb-2 whitespace-nowrap">
            <strong>Здесь живут драконы! 🐲</strong>
          </p>
          <p className="text-sm">
            Это релиз цикла <strong>ALPHA</strong>. Сделайте копию файлов, перед
            использованием их с Ordo. Ну так, на всякий случай.
          </p>
        </div>
      </div>

      <div className="fixed top-0 left-0 right-0 bottom-0 bg-neutral-800 bg-opacity-90 bg-blend-exclusion -z-10"></div>

      <Footer />
    </div>
  )
}

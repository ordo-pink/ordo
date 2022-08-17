import { Link } from "gatsby"
import React from "react"
import { DiWindows, DiLinux, DiApple } from "react-icons/di"
import { HiOutlineBookOpen } from "react-icons/hi"
import { Footer } from "../components/footer"
import { Header } from "../components/header"
import { Seo } from "../components/seo"

export default function PrivateBeta() {
  return (
    <div className="flex flex-col min-h-screen">
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
              href="https://tinyurl.com/ordo-011-win"
              className="flex space-x-2 justify-center items-center px-8 py-2 bg-gradient-to-tr from-pink-500 to-cyan-500 rounded-xl font-bold text-xl text-white whitespace-nowrap"
            >
              <DiWindows />
              <div>Windows</div>
            </a>
          </div>
          <div className="flex flex-col space-y-2">
            <a
              href="https://tinyurl.com/ordo-011-darwin"
              className="flex space-x-2 justify-center items-center px-8 py-2 bg-gradient-to-tr from-pink-500 to-cyan-500 rounded-xl font-bold text-xl text-white whitespace-nowrap"
            >
              <DiApple />
              <div>MacOS</div>
            </a>
          </div>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex flex-col space-y-2">
              <a
                href="https://tinyurl.com/ordo-011-rpm"
                className="flex space-x-2 justify-center items-center px-8 py-2 bg-gradient-to-tr from-pink-500 to-cyan-500 rounded-xl font-bold text-xl text-white whitespace-nowrap"
              >
                <DiLinux />
                <div>Linux (RPM)</div>
              </a>
            </div>
            <div className="flex flex-col space-y-2">
              <a
                href="https://tinyurl.com/ordo-011-deb"
                className="flex space-x-2 justify-center items-center px-8 py-2 bg-gradient-to-tr from-pink-500 to-cyan-500 rounded-xl font-bold text-xl text-white whitespace-nowrap"
              >
                <DiLinux />
                <div>Linux (DEB)</div>
              </a>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Link
              to="/blog/markdown-basics"
              className="flex space-x-2 justify-center items-center  font-bold px-2 py-1"
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
      <Footer />
    </div>
  )
}

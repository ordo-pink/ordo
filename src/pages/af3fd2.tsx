import React from "react"
import { DiApple, DiWindows } from "react-icons/di"
import { Footer } from "../components/footer"
import { GradientTitle } from "../components/gradient-title"
import { Header } from "../components/header"

const PrivateBeta = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-700 dark:to-neutral-800 text-neutral-800 dark:text-neutral-300">
      <Header />
      <div className="flex-grow flex flex-col items-center justify-center justify-self-center self-center">
        <h2 className="text-xl font-bold uppercase border-b border-neutral-800 dark:border-neutral-300">
          Bring Your Thoughts to
        </h2>
        <GradientTitle text="Beta" />
        <div className="mt-5 flex flex-col space-y-2 w-full">
          <a
            href="https://tinyurl.com/ordo-0-1-0-mac"
            className="flex space-x-2 justify-center items-center bg-gradient-to-tr from-purple-600 to-pink-700 text-neutral-200 font-bold px-2 py-1 rounded-lg shadow-lg"
          >
            <DiApple />
            <div>Download for Mac</div>
          </a>
        </div>
        <div className="mt-5 flex flex-col space-y-2 w-full">
          <a
            href="https://tinyurl.com/ordo-0-1-0-win"
            className="flex space-x-2 justify-center items-center bg-gradient-to-bl from-purple-600 to-sky-700 text-neutral-200 font-bold px-2 py-1 rounded-lg shadow-lg"
          >
            <DiWindows />
            <div>Download for Windows</div>
          </a>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default PrivateBeta

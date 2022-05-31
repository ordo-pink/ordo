import React from "react"

import { Seo } from "../components/seo"
import { Footer } from "../components/footer"
import { Header } from "../components/header"
import { GradientTitle } from "../components/gradient-title"

export default function IndexPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-700 dark:to-neutral-800 text-neutral-800 dark:text-neutral-300">
      <Seo
        title="Ordo Home"
        description="Ordo is a knowledge manager for you, your team, and the humanity."
      />
      <Header />
      <div className="flex-grow flex flex-col items-center justify-center justify-self-center self-center">
        <h2 className="text-xl font-bold uppercase border-b border-neutral-800 dark:border-neutral-300">
          Bring Your Thoughts to
        </h2>
        <GradientTitle text="Ordo" />
        <div className="mt-5 text-center">
          <p>
            Private beta starts on <strong>June 15</strong>.
          </p>
          <p>
            Subscribe on{" "}
            <a className="underline" href="https://twitter.com/ordo_pink">
              Twitter
            </a>{" "}
            to participate.
          </p>
        </div>
      </div>
      <Footer />
    </div>
    // <Layout>
    //   <Seo title="Home" />
    //   <div>
    //     <h1 className="text-4xl">Ordo</h1>
    //     {/* <StaticImage
    //       src="../images/example.png"
    //       loading="eager"
    //       width={64}
    //       quality={95}
    //       formats={["auto", "webp", "avif"]}
    //       alt=""
    //     /> */}
    //   </div>
    //   <Footer />
    // </Layout>
  )
}

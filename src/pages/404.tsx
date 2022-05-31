import React from "react"
import { Footer } from "../components/footer"
import { GradientTitle } from "../components/gradient-title"
import { Header } from "../components/header"

import { Seo } from "../components/seo"

export default function NotFoundPage() {
  return (
    <div className="flex flex-col h-screen">
      <Seo title="404: Not found" description="Whoa, you broke the site!" />
      <Header />
      <div className="flex-grow flex items-center justify-center justify-self-center self-center">
        <GradientTitle text="404" />
      </div>
      <Footer />
    </div>
  )
}

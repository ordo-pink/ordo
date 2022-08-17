import React from "react"
import { Footer } from "../components/footer"
import { GradientTitle } from "../components/gradient-title"
import { Header } from "../components/header"

import { Seo } from "../components/seo"

export default function BlogListPage() {
  return (
    <div className="flex flex-col h-screen">
      <Seo title="Блог | В разработке" />
      <Header />
      <div className="flex-grow flex items-center justify-center justify-self-center self-center">
        <GradientTitle text="🚧" />
      </div>
      <Footer />
    </div>
  )
}

import React from "react"

import { Seo } from "../components/seo"
import { Footer } from "../components/footer"
import { Header } from "../components/header"
import { GradientTitle } from "../components/gradient-title"
import { graphql } from "gatsby"

export const pageQuery = graphql`
  query ($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      excerpt
      frontmatter {
        slug
        date(fromNow: true)
        title
      }
    }
  }
`

export default function Post({ data }: any) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br p-2 from-neutral-50 to-neutral-100 dark:from-neutral-700 dark:to-neutral-800 text-neutral-800 dark:text-neutral-300">
      <Seo
        title={data.markdownRemark.frontmatter.title}
        description={data.markdownRemark.frontmatter.excerpt}
      />
      <Header />
      <div className="flex-grow flex flex-col max-w-6xl mx-auto">
        <div className="w-full prose prose-pink lg:prose-lg">
          <h1>{data.markdownRemark.frontmatter.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
        </div>
      </div>
      <Footer />
    </div>
  )
}

import React from "react"

import { Seo } from "../components/seo"
import { Footer } from "../components/footer"
import { Header } from "../components/header"
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
    <div className="flex flex-col min-h-screen">
      <Seo
        title={data.markdownRemark.frontmatter.title}
        description={data.markdownRemark.frontmatter.excerpt}
      />
      <Header />
      <div className="flex-grow flex flex-col max-w-6xl mx-auto">
        <div className="prose prose-pink lg:prose-lg prose-img:rounded-lg dark:prose-invert">
          <h1>{data.markdownRemark.frontmatter.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
        </div>
      </div>
      <Footer />
    </div>
  )
}

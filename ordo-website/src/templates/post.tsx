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
    <>
      <Seo
        title={data.markdownRemark.frontmatter.title}
        description={data.markdownRemark.frontmatter.excerpt}
      />
      <Header />
      <div className="flex flex-col min-h-screen p-6 mt-32">
        <div className="flex-grow flex flex-col max-w-6xl mx-auto">
          <div className="prose prose-amber lg:prose-lg prose-img:rounded-lg prose-invert">
            <h1>{data.markdownRemark.frontmatter.title}</h1>
            <div
              dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }}
            />
          </div>
        </div>
      </div>

      <div className="fixed top-0 left-0 right-0 bottom-0 bg-neutral-800 bg-opacity-90 bg-blend-exclusion -z-10"></div>

      <Footer />
    </>
  )
}

import { graphql, Link, useStaticQuery } from "gatsby"
import React from "react"
import { Footer } from "../components/footer"
import { GradientTitle } from "../components/gradient-title"
import { Header } from "../components/header"

import { Seo } from "../components/seo"

export default function BlogListPage() {
  const { allMarkdownRemark } = useStaticQuery(graphql`
    query BlogPostsQuery {
      allMarkdownRemark(
        filter: { frontmatter: { slug: { glob: "/blog/*" } } }
        sort: { order: ASC, fields: frontmatter___date }
      ) {
        edges {
          node {
            frontmatter {
              slug
              title
              date(fromNow: true, locale: "ru")
            }
            excerpt
          }
        }
      }
    }
  `)

  return (
    <div className="flex flex-col min-h-screen">
      <Seo title="Блог | В разработке" />
      <Header />

      <div className="flex-grow p-4 max-w-4xl mx-auto">
        <h1 className="text-5xl font-black">Блодж</h1>
        {allMarkdownRemark.edges.map(({ node }: any) => (
          <div
            key={node.frontmatter.slug}
            className="py-8 flex flex-col space-y-2 border-b border-b-neutral-500"
          >
            <h2 className="text-3xl font-extrabold">
              <Link to={node.frontmatter.slug}>{node.frontmatter.title}</Link>
            </h2>
            <p className="text-sm">{node.frontmatter.date}</p>
            <p>
              {node.excerpt}{" "}
              <Link
                to={node.frontmatter.slug}
                className="text-amber-500 underline font-bold"
              >
                Читать далее "{node.frontmatter.title}"
              </Link>
            </p>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  )
}

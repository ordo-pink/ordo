import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

type Props = {
  description?: string
  lang?: string
  meta?: Array<{ name: string; content: string }>
  title: string
}

export const Seo: React.FC<Props> = ({
  description = "",
  lang = "en",
  meta = [],
  title,
}) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const defaultTitle = site.siteMetadata?.title

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : void 0}
      meta={[
        {
          name: "description",
          content: metaDescription,
        },
        {
          property: "og:title",
          content: title,
        },
        {
          property: "og:site_name",
          content: "Ordo.pink",
        },
        {
          property: "og:description",
          content: metaDescription,
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:locale",
          content: "ru_RU",
        },
        {
          property: "og:image",
          content: "https://ordo.pink/og.jpg",
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
        {
          name: "twitter:creator",
          content: "@ordo_pink",
        },
        {
          name: "twitter:title",
          content: title,
        },
        {
          property: "twitter:image",
          content: "https://ordo.pink/og.jpg",
        },
        {
          name: "twitter:description",
          content: metaDescription,
        },
      ].concat(meta)}
    />
  )
}

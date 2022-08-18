module.exports = {
  siteMetadata: {
    title: "Ordo.pink",
    description:
      "Ordo - это система управления знаниями для тебя, твоей команды и всего человечества.",
    author: "Ordo.pink",
    siteUrl: "https://ordo.pink",
  },

  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-postcss",
    "gatsby-plugin-robots-txt",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "markdown-pages",
        path: `${__dirname}/src/markdown-pages`,
      },
    },
    "gatsby-plugin-image",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "assets",
        path: `${__dirname}/assets`,
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-images",
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 1000,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-yandex-metrika`,
      options: {
        trackingId: 89994639,
        webvisor: true,
        trackHash: true,
        afterBody: true,
        defer: false,
      },
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Ordo.pink",
        short_name: "Ordo",
        start_url: "/",
        background_color: "#292524",
        theme_color: "#292524",
        display: "minimal-ui",
        icon: "src/images/gatsby-icon.png", // This path is relative to the root of the site.
      },
    },
    "gatsby-plugin-offline",
  ],
}

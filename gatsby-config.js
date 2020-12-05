require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `Takakisan`,
    description: `Takakisan`,
    author: `@zzzaaawwwaaa`,
    settings: {
      articlesPerPage: 10,
    },
    siteUrl: `https://takakisan.com/`
  },
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: process.env.GATSBY_GOOGLE_ANALYTICS_TRACKING_ID,
        head: true,
      }
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        exclude: [`/articles/*`]
      }
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
              wrapperStyle: `
                max-height: 400px;
                overflow: hidden;
              `,
              backgroundColor: `none`,
            }
          },
          {
            resolve: `gatsby-remark-vscode`,
            options: {
              theme: `Kimbie Dark`
            }
          }
        ],
      },
    },
    {
      resolve: "gatsby-remark-related-posts",
      options: {
        posts_dir: `${__dirname}/src/articles`,
        doc_lang: "ja",
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `takakisan`,
        short_name: `takakisan`,
        start_url: `/`,
        icon: `src/images/favicon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-google-adsense`,
      options: {
        publisherId: `ca-pub-1028835021221490`
      },
    },
  ],
}

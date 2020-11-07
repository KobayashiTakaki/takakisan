const path = require(`path`)
const _ = require("lodash")
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `articles` })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const articleTemplate = path.resolve("src/templates/article.js")
  const tagArticlesTemplate = path.resolve("src/templates/tag-articles.js")

  const result = await graphql(`
    {
      articlesRemark: allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 2000
      ) {
        edges {
          node {
            fields {
              slug
              relatedFileAbsolutePaths
            }
            frontmatter {
              tags
            }
          }
        }
      }
      tagsGroup: allMarkdownRemark(limit: 2000) {
        group(field: frontmatter___tags) {
          fieldValue
          totalCount
        }
      }
      perSetting: site {
        siteMetadata {
          settings {
            articlesPerPage
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  const articles = result.data.articlesRemark.edges

  // 個別記事ページの作成
  articles.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: articleTemplate,
      context: {
        slug: node.fields.slug,
        relatedFilePaths: node.fields.relatedFileAbsolutePaths.slice(0, 4),
      },
    })
  })

  const per = result.data.perSetting.siteMetadata.settings.articlesPerPage
  const numPages = Math.ceil(articles.length / per)
  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/` : `/articles/${i + 1}`,
      component: path.resolve("./src/templates/articles.js"),
      context: {
        limit: per,
        skip: i * per,
        basePath: `/articles/`,
        numPages,
        currentPage: i + 1,
      },
    })
  })

  // タグの記事一覧ページの作成
  const tags = result.data.tagsGroup.group
  tags.forEach(tag => {
    const numPages = Math.ceil(tag.totalCount / per)
    const tagName = _.kebabCase(tag.fieldValue)
    Array.from({ length: numPages }).forEach((_e, i) => {
      createPage({
        path: `/tags/${tagName}/${i + 1}`,
        component: tagArticlesTemplate,
        context: {
          tag: tag.fieldValue,
          limit: per,
          skip: i * per,
          basePath: `/tags/${tagName}/`,
          numPages,
          currentPage: i + 1,
        },
      })
    })
  })
}

exports.createResolvers = ({ createResolvers }) => {
  const resolvers = {
    MarkdownRemark: {
      titleImage: {
        type: 'File',
        resolve(source, args, context, info) {
          const relativeDirectory = context.nodeModel.getNodeById({
            id: source.parent
          }).relativeDirectory
          return context.nodeModel.runQuery({
            query: {
              filter: {
                relativeDirectory: {
                  eq: relativeDirectory
                },
                name: { eq: 'title' },
                extension: {
                  in: ['png', 'jpg']
                },
              },
            },
            type: 'File',
            firstOnly: true
          })
        }
      }
    }
  }
  createResolvers(resolvers)
}

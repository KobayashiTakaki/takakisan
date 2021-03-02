import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Img from "gatsby-image"

import TagList from "../components/tag-list"
import InArticleAd from "../components/in-article-ad"
import RelatedArticles from "../components/related-articles"
import AsideTags from "../components/aside-tags"
import { TwitterShareButton, TwitterIcon } from "react-share"
import styles from "./article.module.css"

export default function Article({ data }) {
  const article = data.markdownRemark
  const articleTitle = article.frontmatter.title
  const urljoin = require(`url-join`)
  return (
    <Layout>
      <SEO title={articleTitle} />
      <div className={styles.article}>
        <h1>{article.frontmatter.title}</h1>
        <div className={styles.date}>
          <p className={styles.date__text}>{article.frontmatter.date}</p>
        </div>
        <div className={styles.titleImage}>
          <Img
            fluid={article.titleImage.childImageSharp.fluid}
            style={{ height: "100%", borderRadius: "3px" }}
            imgStyle={{ objectFit: "cover" }}
            alt={articleTitle}
          />
        </div>
        <div className={styles.tagList}>
          <TagList tags={article.frontmatter.tags} />
        </div>
        <InArticleAd adSlot={4202835281} />
        <section dangerouslySetInnerHTML={{ __html: article.html }} />
        <div className={styles.snsButtons}>
          <TwitterShareButton
            title={articleTitle}
            url={urljoin(process.env.GATSBY_ROOT_URL, article.fields.slug)}
          >
            <TwitterIcon size={32} borderRadius={8} />
          </TwitterShareButton>
        </div>
      </div>
      <h4>スポンサーリンク</h4>
      <InArticleAd adSlot={3831300191} />
      <RelatedArticles articles={data.relatedArticles} />
      <AsideTags />
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!, $relatedFilePaths: [String]) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        tags
        date
      }
      fields {
        slug
      }
      titleImage {
        childImageSharp {
          fluid(maxWidth: 800) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
    relatedArticles: allMarkdownRemark(
      filter: { fileAbsolutePath: { in: $relatedFilePaths } }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            title
            date
            tags
          }
          titleImage {
            childImageSharp {
              fixed(width: 240) {
                ...GatsbyImageSharpFixed
              }
            }
          }
        }
      }
    }
  }
`

import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <h1>404: Not Found</h1>
    <p>
      ページが見つかりませんでした。
      <br />
      <Link to="/">トップへ戻る</Link>
    </p>
  </Layout>
)

export default NotFoundPage

import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { Link } from "gatsby"

const PolicyPage = () => (
  <Layout>
    <SEO title="プライバシーポリシー" />
    <h1>プライバシーポリシー</h1>
    <h2>当サイトが使用しているアクセス解析ツールについて</h2>
    <p>
      当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。
    </p>
    <p>
      このGoogleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。
      <br />
      このトラフィックデータは匿名で収集されており、個人を特定するものではありません。
      <br />
      この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。
      <br />
      この規約に関して、詳しくは
      <a
        href="http://www.google.com/analytics/terms/jp.html"
        target="_blank"
        rel="noopener noreferrer"
      >
        こちら
      </a>
      、または
      <a
        href="https://www.google.com/intl/ja/policies/privacy/partners/"
        target="_blank"
        rel="noopener noreferrer"
      >
        こちら
      </a>
      をご確認ください。
    </p>
    <h2>お問い合わせ</h2>
    <p>
      <Link to="/contact">こちら</Link>
      のフォームよりお願いいたします。
    </p>
  </Layout>
)

export default PolicyPage

import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"

import styles from "./about-me.module.css"

const AboutMePage = () => (
  <Layout>
    <SEO title="About Me" path="/about-me"/>
    <div className={styles.policy}>
      <h1>About Me</h1>
      <p>
        コバヤシ
        <br />
        1991年生
      </p>
      <p>システムエンジニアです。</p>
      <p>
        Twitter:&nbsp;
        <a
          href="https://twitter.com/zzzaaawwwaaa"
          target="_blank"
          rel="noopener noreferrer"
        >
          @zzzaaawwwaaa
        </a>
      </p>
    </div>
  </Layout>
)

export default AboutMePage

/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, Link, graphql } from "gatsby"

import "destyle.css"
import styles from "./layout.module.css"
import LogoImage from "../images/logo.png"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
      <div className={styles.container}>
        <main>{children}</main>
      </div>
      <BottomMenu />
      <Footer />
    </>
  )
}

const Header = ({ siteTitle }) => (
  <header className={styles.siteHeader}>
    <Link to="/">
      <img
        src={LogoImage}
        alt="takakisan"
        className={styles.siteHeader__logo}
      />
    </Link>
  </header>
)

const BottomMenu = () => {
  return (
    <div className={styles.bottomMenu}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about-me">About Me</Link>
        </li>
        <li>
          <Link to="/policy">プライバシーポリシー</Link>
        </li>
        <li>
          <Link to="/contact">お問い合わせ</Link>
        </li>
      </ul>
    </div>
  )
}

const Footer = () => (
  <footer className={styles.footer}>
    <p className={styles.footer__text}>
      © {new Date().getFullYear()} Takaki Kobayashi
    </p>
  </footer>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Layout

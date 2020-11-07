import { Link } from "gatsby"
import React from "react"

import styles from './paginator.module.css'
const path = require('path')

const Paginator = ({ basePath, currentPage, numPages }) => {
  if(numPages <= 1) {
    return null
  }
  let linksElem
  if(currentPage <= 1) {
    linksElem =
      <div className={styles.paginator__links}>
        <NextLink basePath={basePath} currentPage={currentPage}/>
      </div>
  } else if(numPages <= currentPage) {
    linksElem =
      <div className={styles.paginator__links}>
        <PrevLink basePath={basePath} currentPage={currentPage}/>
      </div>
  } else {
    linksElem =
      <div className={styles.paginator__links}>
        <PrevLink basePath={basePath} currentPage={currentPage}/>
        <NextLink basePath={basePath} currentPage={currentPage}/>
      </div>
  }
  return (
    <div className={styles.paginator}>
      {linksElem}
      <Counter currentPage={currentPage} numPages={numPages}/>
    </div>
  )
}

const Counter = ({ currentPage, numPages }) => (
  <div className={styles.counter}>
    <span className={styles.counter__num}>{currentPage}</span>
    of
    <span className={styles.counter__num}>{numPages}</span>
  </div>
)

const PrevLink = ({ basePath, currentPage }) => {
  let link
  // /articles/の1ページ目だけはrootにしたいので
  if(basePath === `/articles/` && currentPage === 2) {
    link = `/`
  } else {
    link = path.join(basePath, (currentPage - 1).toString())
  }
  return (
    <Link to={link}>
      <div className={styles.paginator__link}>
        ＜ 新しい方
      </div>
    </Link>
  )
}

const NextLink = ({ basePath, currentPage }) => (
  <Link to={path.join(basePath, (currentPage + 1).toString())}>
    <div className={styles.paginator__link}>
      もっと前 ＞
    </div>
  </Link>
)

export default Paginator

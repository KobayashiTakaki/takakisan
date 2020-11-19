import React from "react"
import styles from "./article-list-ad.module.css"
import DisplayAd from "./google-ad-sense/display-ad"

const ArticleListAd = ({ adSlot }) => {
  return (
    <div className={styles.articleListAd}>
      <DisplayAd adSlot={adSlot}/>
    </div>
  )
}

export default ArticleListAd

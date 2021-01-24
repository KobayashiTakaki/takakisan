import React from "react"
import styles from "./in-article-ad.module.css"
import DisplayAd from "./google-ad-sense/display-ad"

const InArticleAd = ({ adSlot }) => {
  return (
    <div className={styles.inArticleAd}>
      <DisplayAd adSlot={adSlot} />
    </div>
  )
}

export default InArticleAd

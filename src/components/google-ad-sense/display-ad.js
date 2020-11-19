import React from "react"

class DisplayAd extends React.Component {
  componentDidMount() {
    if (window) {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
    }
  }

  render() {
    return (
      <ins
        style={{ display: `block` }}
        className="adsbygoogle"
        data-ad-client="ca-pub-1028835021221490"
        data-ad-slot={this.props.adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    )
  }
}

export default DisplayAd

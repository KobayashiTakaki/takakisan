import React from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"

const ContactPage = () => (
  <Layout>
    <SEO title="お問い合わせ" />
    <GoogleForm />
  </Layout>
)

const GoogleForm = () => (
  <iframe
    title="google-form"
    src="https://docs.google.com/forms/d/e/1FAIpQLSfgesq-gdjCLAErjMYoFj-wKc9B6ttnIJylPxgG96rua0sY3A/viewform?embedded=true"
    width="100%"
    height="660"
    frameBorder="0"
    marginHeight="0"
    marginWidth="0"
  >
    読み込んでいます…
  </iframe>
)

export default ContactPage

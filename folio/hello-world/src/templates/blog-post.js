import React from "react"
import Layout from "../components/layout"

export default function BlogPost({ pageContext }) {
  const { html, title } = pageContext;
  return (
    <Layout>
      <h3>
        {
          title
        }
      </h3>
      <article 

      >
        <div 
          dangerouslySetInnerHTML={{
            __html: html
          }}
        />
      </article>
    </Layout>
  )
}

import React from "react"
import Layout from "../components/layout"
import { rhythm } from "../utils/typography"
import { Link, graphql } from "gatsby"
import { css } from "@emotion/react"
import tw from "twin.macro"

const Button = tw.button`bg-blue-500 hover:bg-blue-800 text-white p-2 rounded`

export default function Home({ data }) {
  console.log(data);
  return (
    <Layout>
      <div>
        <Button>
          hi there
        </Button>
        <h1
          css={css`
            display: inline-block;
            border-bottom: 1px solid;
            color: #cccccc;
          `}
        >
          Amazing Pandas Eating Things
        </h1>
        <h4>{data.allMarkdownRemark.totalCount} Posts</h4>
        {data.allMarkdownRemark.edges.map(({ node }) => (
          <div key={node.id}>
            <Link
              to={node.fields.slug}
              css={css`
                text-decoration: none;
                color: inherit;
              `}
            >
              <h3
                css={css`
                  margin-bottom: ${rhythm(1 / 4)};
                `}
              >
                {node.frontmatter.title}{" "}
                <span
                  css={css`
                    color: #bbb;
                  `}
                >
                  — {node.frontmatter.date}
                </span>
              </h3>
              <p>{node.excerpt}</p>
            </Link>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export const query = graphql`{
  allMarkdownRemark {
    edges {
      node {
        excerpt
        id
        frontmatter {
          title
          date(formatString: "DD/MM/YYYY")
        }
        fields {
          slug
        }
      }
    }
    totalCount
  }
}`

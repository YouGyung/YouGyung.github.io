import * as React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import PostPreview from "../components/post/PostPreview"
import styled from "@emotion/styled"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  return (
    <Layout location={location} title={siteTitle}>
      <PostListStyle className="claymorphism">
        {posts.map(post => {
          return (
            <li key={post.frontmatter.title}>
              <PostPreview post={post} />
            </li>
          )
        })}
      </PostListStyle>
    </Layout>
  )
}

export default BlogIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="All posts" />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "YYYY.MM.DD")
          title
          description
          image {
            childImageSharp {
              gatsbyImageData(width: 400)
            }
          }
        }
      }
    }
  }
`

const PostListStyle = styled.ol`
  padding: var(--spacing-2) var(--layout-width-padding);
  list-style: none;

  li:last-child > article {
    border-bottom: 0px solid var(--color-line);
    padding-bottom: var(--spacing-12);
  }
`

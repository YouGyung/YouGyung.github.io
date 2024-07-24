import * as React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import { StaticImage } from "gatsby-plugin-image"
import { GatsbyImage } from "gatsby-plugin-image"
import { Post, Nav, Info } from "./blog-post.style.js"

const BlogPostTemplate = ({
  data: { previous, next, site, markdownRemark: post },
  location,
}) => {
  const siteTitle = site.siteMetadata?.title || `Title`

  const handleClickIcon = () => {
    let nowUrl = window.location.href
    navigator.clipboard.writeText(nowUrl).then(res => {
      alert("복사되었어요")
    })
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Post itemScope itemType="http://schema.org/Article">
        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <Info>
            <p>{post.frontmatter.date}</p>
            <div className="icon" onClick={handleClickIcon}>
              <StaticImage
                src="./clip.svg"
                width={24}
                height={24}
                alt={"URL Ctrl+C Icon"}
              />
              <span>URL Ctrl+C</span>
            </div>
          </Info>
        </header>
        <GatsbyImage
          image={post.frontmatter.image.childImageSharp.gatsbyImageData}
          alt="Profile picture"
          className="glassmorphism"
        />
        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
        <hr />
      </Post>
      <Nav>
        <ul>
          <li className="">
            {previous && (
              <Link
                className="claymorphism"
                to={previous.fields.slug}
                rel="prev"
              >
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link className="claymorphism" to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </Nav>
    </Layout>
  )
}

export const Head = ({ data: { markdownRemark: post } }) => {
  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
    />
  )
}
export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
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
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`

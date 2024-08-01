import React from "react"

import { GatsbyImage } from "gatsby-plugin-image"
import ShareURLButton from "../common/ShareURLButton"

function Post({ post }: any) {
  const { title, date, image } = post.frontmatter

  return (
    <PostStyle itemScope itemType="http://schema.org/Article">
      <header>
        <h1 itemProp="headline">{title}</h1>
        <PostInfoStyle>
          <p>{date}</p>
          <ShareURLButton />
        </PostInfoStyle>
      </header>
      <CenterStyle>
        <GatsbyImage
          image={image.childImageSharp.gatsbyImageData}
          alt="article picture"
          className="article_picture glassmorphism"
        />
      </CenterStyle>
      <section
        dangerouslySetInnerHTML={{ __html: post.html }}
        itemProp="articleBody"
      />
      <hr />
    </PostStyle>
  )
}

export default Post

import styled from "@emotion/styled"

export const PostStyle = styled.article`
  max-width: var(--post-width);
  margin: var(--spacing-10) auto;
  padding: 0 var(--layout-width-padding);
  overflow: hidden;
  margin: 0 auto;
  font-size: var(--fontSize-2);
  .article_picture {
    width: calc(100vw - 2 * var(--layout-width-padding));
  }

  section img {
    width: calc(var(--post-width) - 2 * var(--layout-width-padding));
    max-width: calc(100vw - 2 * var(--layout-width-padding));
  }
  pre {
    font-size: small;
  }
`

export const PostInfoStyle = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--color-subText);
`
const CenterStyle = styled.div`
  display: flex;
  justify-content: center;
  margin: var(--spacing-4);
`

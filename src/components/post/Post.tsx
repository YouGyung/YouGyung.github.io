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
          alt="Profile picture"
          className="glassmorphism"
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
  padding: 0 var(--layout-width-padding);
  overflow: hidden;
  margin: 0 auto;
  font-size: var(--fontSize-2);
  img {
    max-width: var(--post-width);
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

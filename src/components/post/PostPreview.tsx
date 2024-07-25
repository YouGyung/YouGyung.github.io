import React from "react"
import { GatsbyImage } from "gatsby-plugin-image"
import { Link } from "gatsby"
import styled from "@emotion/styled"

function PostPreview({ post }) {
  return (
    <PreviewLayoutStyle itemScope itemType="http://schema.org/Article">
      <PreviewImageStyle className="glassmorphism">
        <GatsbyImage
          image={post.frontmatter.image.childImageSharp.gatsbyImageData}
          alt="Profile picture"
        />
      </PreviewImageStyle>
      <PreviewTextStyle>
        <header>
          <small>{post.frontmatter.date}</small>
          <h2>
            <Link to={post.fields.slug} itemProp="url">
              <span itemProp="headline">{post.frontmatter.title}</span>
            </Link>
          </h2>
        </header>
        <section>
          <p
            dangerouslySetInnerHTML={{
              __html: post.frontmatter.description || post.excerpt,
            }}
            itemProp="description"
          />
        </section>
      </PreviewTextStyle>
    </PreviewLayoutStyle>
  )
}

export default PostPreview

const PreviewLayoutStyle = styled.article`
  border-bottom: 1px solid var(--color-line);
  padding: var(--spacing-8) 0;
  display: flex;
  gap: var(--spacing-8);

  p {
    margin-bottom: var(--spacing-0);
    color: var(--color-text);
    font-size: var(--fontSize-1);
  }

  small {
    margin-left: var(--spacing-1);
    color: var(--color-subText);
  }

  h2 {
    font-size: var(--fontSize-4);
    margin: var(--spacing-4) 0;
  }

  &:hover {
    color: var(--color-primary);
  }

  &:hover img {
    transform: scale(1.1);
  }

  header {
    margin-bottom: var(--spacing-4);
  }
`
const PreviewTextStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  p {
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`

const PreviewImageStyle = styled.div`
  min-width: var(--image-width);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: var(--spacing-8);
  overflow: hidden;
  @media (max-width: 60rem) {
    display: none;
  }

  img {
    width: var(--image-width);
    height: var(--image-height);
  }
`

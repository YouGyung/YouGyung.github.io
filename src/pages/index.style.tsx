import styled from "@emotion/styled"

export const PostList = styled.ol`
  padding: var(--spacing-2) var(--layout-width-padding);
  list-style: none;

  li:last-child > article {
    border-bottom: 0px solid var(--color-line);
    padding-bottom: var(--spacing-12);
  }
`

export const PostListItem = styled.article`
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

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`

export const Image = styled.div`
  min-width: var(--image-width);
  height: var(--image-height);
  border-radius: var(--spacing-8);
  overflow: hidden;

  img {
    width: var(--image-width);
    height: var(--image-height);
  }
`

import styled from "@emotion/styled"

export const Post = styled.article`
  max-width: var(--post-width);
  padding: 0 var(--layout-width-padding);
  overflow: hidden;
  margin: 0 auto;
  font-size: var(--fontSize-2);

  img {
    max-width: var(--post-width);
  }
`

export const Info = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--color-subText);
`

export const Nav = styled.nav`
  ul {
    display: flex;
    justify-content: space-between;
    text-align: center;
    list-style: none;
  }

  li {
    padding: 0 var(--layout-width-padding);
    max-width: var(--post-width);
    margin: var(--spacing-8) auto;
    line-height: var(--fontSize-7);
  }

  a {
    padding: var(--spacing-4);
    color: var(--color-primary);
    text-decoration: none;
    width: max-content;
  }
`

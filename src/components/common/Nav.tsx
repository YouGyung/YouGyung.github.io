import React from "react"
import { Link } from "gatsby"

function Nav({ previous, next }: any) {
  return (
    <NavStyle>
      <ul>
        <li className="">
          {previous && (
            <Link className="claymorphism" to={previous.fields.slug} rel="prev">
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
    </NavStyle>
  )
}

export default Nav

import styled from "@emotion/styled"

export const NavStyle = styled.nav`
  ul {
    display: flex;
    justify-content: space-between;
    text-align: center;
    list-style: none;
    @media (max-width: 60rem) {
      display: block;
    }
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

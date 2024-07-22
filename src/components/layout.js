import * as React from "react"
import { Link } from "gatsby"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <>
        <h1 className="main-heading">{title}</h1>
        <div>
          <Link to="/" style={{ color: "var(--color-primary)" }}>
            Tech
          </Link>
          <Link to="/about">About</Link>
        </div>
      </>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main className="global-main">{children}</main>
      <footer className="global-footer">
        Copyright © yougyung All rights reserved. <br />
        2024 | built with <a href="https://www.gatsbyjs.com">Gatsby</a> |
        Developed by <a href="https://github.com/yougyung">yougyung</a>
      </footer>
    </div>
  )
}

export default Layout

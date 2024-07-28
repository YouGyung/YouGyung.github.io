import React from "react"
import { StaticImage } from "gatsby-plugin-image"

function ShareURLButton() {
  const handleClickIcon = () => {
    let nowUrl = window.location.href
    navigator.clipboard.writeText(nowUrl).then(res => {
      alert("복사되었어요")
    })
  }

  return (
    <IconStyle onClick={handleClickIcon}>
      <StaticImage src="../../assets/clip.svg" alt={"URL Ctrl+C Icon"} />
      <span>URL Ctrl+C</span>
    </IconStyle>
  )
}

export default ShareURLButton

import styled from "@emotion/styled"

export const IconStyle = styled.div`
  position: relative;

  span {
    position: absolute;
    background-color: black;
    width: 100px;
    color: white;
    top: 40px;
    text-align: center;
    padding: 4px;
    font-size: var(--fontSize-1);
    border-radius: 5px;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    transition: 0.5s;
    visibility: hidden;
  }

  img {
    height: 40px;
    padding: 6px 2px;
  }

  &:hover span {
    opacity: 1;
    visibility: visible;
  }

  &:hover img {
    background-color: var(--color-line);
    border-radius: var(--spacing-1);
  }

  @media (max-width: 30rem) {
    img {
      height: 32px;
    }
  }
`

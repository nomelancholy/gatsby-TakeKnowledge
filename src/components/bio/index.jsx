import React from 'react'
import { StaticQuery, graphql, Link } from 'gatsby'
import Image from 'gatsby-image'

import './index.scss'

export const Bio = () => (
  <StaticQuery
    query={bioQuery}
    render={data => {
      const { author, introduction } = data.site.siteMetadata

      return (
        <div className="bio">
          <div className="author">
            <div className="author-description">
              <Image
                className="author-image"
                fixed={data.avatar.childImageSharp.fixed}
                alt={author}
                style={{
                  borderRadius: `100%`,
                }}
              />
              <div className="author-name">
                <span className="author-name-prefix">Written by</span>
                {/* <Link to={'/about'} className="author-name-content"> */}
                <a href={'#'} className="author-name-content">
                  <span>@{author}</span>
                </a>
                {/* </Link> */}
                <div className="author-introduction">{introduction}</div>
                <p className="author-socials">
                  <a
                    href={`https://stackshare.io/nomelancholy/my-stack#stack`}
                    target={`_blank`}
                  >
                    skills
                  </a>
                  <a
                    href={`https://nomelancholy.github.io/project-skill-map/`}
                    target={`_blank`}
                  >
                    projects
                  </a>

                  <a
                    href={`https://www.rocketpunch.com/@ceb3dd1534ca4f23`}
                    target={`_blank`}
                  >
                    carrer
                  </a>
                  {/* <a
                    href={`https://www.rocketpunch.com/@ceb3dd1534ca4f23`}
                    target={`_blank`}
                  >
                    tags
                  </a> */}
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }}
  />
)

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile.png/" }) {
      childImageSharp {
        fixed(width: 72, height: 72) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        introduction
        social {
          twitter
          github
          medium
          facebook
          linkedin
        }
      }
    }
  }
`

export default Bio

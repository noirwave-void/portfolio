import * as React from "react"

export interface MinimalistHeroProps {
  logoText: string
  navLinks: { label: string; href: string }[]
  mainText: string
  readMoreLink: string
  imageSrc: string
  imageAlt: string
  overlayText: { part1: string; part2: string }
  locationText: string
  className?: string
}

export function MinimalistHero({
  logoText,
  navLinks,
  mainText,
  readMoreLink,
  imageSrc,
  imageAlt,
  overlayText,
  locationText,
  className = "",
}: MinimalistHeroProps) {
  return (
    <section className={`hero ${className}`} id="top" aria-labelledby="hero-title">
      <header className="site-nav">
        <a className="nav-name" href="#top">{logoText}</a>
        <nav aria-label="Main navigation">
          {navLinks.map((link) => <a href={link.href} key={link.label}>{link.label}</a>)}
        </nav>
      </header>

      <div className="hero-content">
        <div className="hero-copy" data-reveal>
          <p className="hero-description">{mainText}</p>
          <a className="button" href={readMoreLink}>Explore the work <span aria-hidden="true">↘</span></a>
        </div>
        <figure className="hero-portrait" data-reveal>
          <span className="hero-disc" aria-hidden="true" />
          <img src={imageSrc} alt={imageAlt} fetchPriority="high" />
        </figure>
        <div className="hero-title-wrap" data-reveal>
          <h1 id="hero-title">{overlayText.part1}<br />{overlayText.part2}</h1>
        </div>
      </div>

      <div className="hero-foot">
        <a className="scroll-cue" href="#intro">Scroll to explore <span aria-hidden="true">↓</span></a>
        <p className="hero-side">{locationText}</p>
      </div>
    </section>
  )
}

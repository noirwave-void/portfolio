import { useEffect, useState } from 'react';
import { ShowcaseSubject } from './ShowcaseSubject';

export function VisualShowcase({ config, error }) {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => { const onScroll = () => setScrollY(window.scrollY); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll); }, []);
  const { theme, typography, subject, animation } = config;
  const scrollProgress = Math.max(0, Math.min(1, scrollY / Math.max(window.innerHeight, 1)));
  const parallaxOffset = animation.parallax ? Math.min(68, scrollY * animation.intensity * .055) : 0;
  const style = {
    '--bg': theme.background, '--ink': theme.foreground, '--muted': theme.muted, '--accent': theme.accent, '--panel': theme.panel,
    '--display-family': typography.family === 'serif' ? `'${typography.display || 'Playfair Display'}', Georgia, serif` : `'${typography.display || 'Space Grotesk'}', Arial, sans-serif`,
    '--display-scale': typography.scale, '--copy-align': typography.alignment, '--duration': `${animation.duration}ms`, '--scroll-progress': scrollProgress
  };
  return <section className={`visual-showcase layout-${config.layout} align-${typography.alignment}`} style={style}>
    <div className="showcase-grain" aria-hidden="true" />
    <header className="showcase-nav"><a href="#top" className="wordmark">V / S</a><div><span>VISUAL SHOWCASE</span><span>CONFIGURABLE EDITION</span></div></header>
    <div className="showcase-stage">
      <div className={`type-field entrance-${animation.entrance}`} style={{ animationDuration: `${animation.duration}ms` }}>
        <p className="showcase-subtitle">{config.subtitle}</p>
        <h1>{config.title}</h1>
        <p className="showcase-description">{config.description}</p>
      </div>
      <ShowcaseSubject subject={subject} parallax={animation.parallax} parallaxOffset={parallaxOffset} />
      <div className="stage-orb" aria-hidden="true" />
      <aside className="showcase-meta">{(config.metadata || []).map((item) => <span key={item}>{item}</span>)}</aside>
      <p className="showcase-note">Scroll to let the composition settle into its specimen view.</p>
      {error && <p className="showcase-error" role="alert">{error}</p>}
    </div>
    <footer className="showcase-footer"><span>Continue below</span><span>{config.layout} layout</span></footer>
    <section className="showcase-detail" aria-label="Showcase details">
      <div><p className="detail-label">Subject behavior</p><p className="detail-copy">The visual subject shifts gently as you scroll while the editorial field gives way to its supporting details.</p></div>
      <div className="detail-list"><span>{subject.fit || 'contain'} fit</span><span>{animation.parallax ? 'scroll-linked motion' : 'static composition'}</span><span>{typography.alignment} alignment</span></div>
    </section>
  </section>;
}

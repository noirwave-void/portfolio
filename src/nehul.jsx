import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { MinimalistHero } from '../components/ui/minimalist-hero';
import HalftoneWordmarkFooter from '../components/ui/halftone-wordmark-footer';
import './nehul.css';

function Reveal({ children, className = '' }) {
  return <div className={className} data-reveal>{children}</div>;
}

function App() {
  useEffect(() => {
    const items = [...document.querySelectorAll('[data-reveal]')];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="portfolio">
      <MinimalistHero
        logoText="Nehul Sinha"
        navLinks={[{ label: 'Work', href: '#work' }, { label: 'About', href: '#about' }, { label: 'Practice', href: '#practice' }, { label: 'Contact', href: '#contact' }]}
        mainText="I’m Nehul, a 19-year-old filmmaker and photographer focused on fitness, lifestyle and the moments between."
        readMoreLink="#work"
        imageSrc="/nehul-hero-cutout.png"
        imageAlt="Black-and-white bird’s-eye portrait of Nehul in a denim jacket, white shirt and sunglasses."
        overlayText={{ part1: 'Stories', part2: 'in motion.' }}
        locationText="19 years old · India"
      />

      <section className="intro section-space" id="intro" aria-labelledby="intro-title">
        <div className="intro-title" data-reveal><p className="section-kicker">A point of view</p><h2 id="intro-title">Make the everyday<br />feel cinematic.</h2></div>
        <div className="intro-copy" data-reveal><p>I’m 19 and building a visual practice through filmmaking, cinematography and photography. I’m interested in honest light, considered movement and the small details that make a moment stay with you.</p><p>Alongside the camera, I create fitness and lifestyle content shaped by the routines and places I actually live in.</p></div>
        <div className="intro-mark" aria-hidden="true">NS</div>
      </section>

      <section className="work section-space" id="work" aria-labelledby="work-title">
        <div className="section-heading" data-reveal><p className="section-kicker">What I make</p><h2 id="work-title">Work, in progress.</h2><p>Selected directions for the stories I want to tell. A growing body of work, made with intention.</p></div>
        <div className="work-list">
          <article className="work-entry" data-reveal><span className="work-type">Moving image</span><h3>Training, in rhythm</h3><p>A short-form visual study of effort, repetition and the quiet focus around a training session.</p><span className="work-medium">Film · Fitness</span></article>
          <article className="work-entry" data-reveal><span className="work-type">On set</span><h3>Between the frames</h3><p>Observing the process: the camera setup, the pause before action and the people shaping a scene.</p><span className="work-medium">Cinematography · BTS</span></article>
          <article className="work-entry" data-reveal><span className="work-type">Still image</span><h3>Ordinary light</h3><p>Portraits and everyday details, photographed with room for atmosphere and a little imperfection.</p><span className="work-medium">Photography · Lifestyle</span></article>
        </div>
      </section>

      <section className="about section-space" id="about" aria-labelledby="about-title">
        <div className="about-number" aria-hidden="true">19</div>
        <div className="about-content" data-reveal><p className="section-kicker">A little about me</p><h2 id="about-title">Curious by nature.<br />Intentional by frame.</h2><p>I’m learning by making: testing ideas, paying attention to the world around me and getting more deliberate with every cut. I value the work behind a good image as much as the image itself.</p><p>I’m open to conversations with creative teams, founders and collaborators who care about making thoughtful work.</p></div>
      </section>

      <section className="interlude section-space" aria-label="Creative thought"><p data-reveal>“The camera gives me a reason to look closer.”</p><span>Nehul Sinha</span></section>

      <section className="practice section-space" id="practice" aria-labelledby="practice-title">
        <div className="practice-heading" data-reveal><p className="section-kicker">Areas of focus</p><h2 id="practice-title">One eye, many formats.</h2></div>
        <div className="practice-columns">
          <article data-reveal><h3>Film</h3><p>Short-form stories, camera-led studies and behind-the-scenes work.</p><span>01</span></article>
          <article data-reveal><h3>Photography</h3><p>Portraits, movement and the details that give a place its character.</p><span>02</span></article>
          <article data-reveal><h3>Creator work</h3><p>Fitness and lifestyle content with a grounded, personal point of view.</p><span>03</span></article>
        </div>
      </section>

      <section className="approach section-space" aria-labelledby="approach-title">
        <div data-reveal><p className="section-kicker">How I work</p><h2 id="approach-title">Look. Feel.<br />Then frame.</h2></div>
        <div className="approach-copy"><p data-reveal><strong>Notice the moment.</strong> Start with the people, the light and what is already happening.</p><p data-reveal><strong>Find its rhythm.</strong> Let movement and feeling guide the camera, not the other way around.</p><p data-reveal><strong>Shape with care.</strong> Make a clear edit that feels true to the story and the people in it.</p></div>
      </section>

      <section className="contact section-space" id="contact" aria-labelledby="contact-title">
        <div data-reveal><p className="section-kicker">The next frame</p><h2 id="contact-title">Have something<br />good in mind?</h2></div>
        <div className="contact-copy" data-reveal><p>I’m open to creative opportunities, collaborations and conversations about visual storytelling.</p><a className="contact-link" href="mailto:hello@example.com?subject=Creative%20collaboration%20with%20Nehul">Start a conversation <span aria-hidden="true">↗</span></a><small>Replace hello@example.com with Nehul’s preferred contact before publishing.</small></div>
      </section>

      <HalftoneWordmarkFooter
        wordmark="nehul sinha"
        label="Nehul Sinha"
        meta="Film · photography · movement"
        preset="night"
        height="480px"
        columns={[
          { title: 'Explore', links: [{ label: 'Work', href: '#work' }, { label: 'About', href: '#about' }, { label: 'Practice', href: '#practice' }] },
          { title: 'Make', links: [{ label: 'Film', href: '#practice' }, { label: 'Photography', href: '#practice' }, { label: 'Creator work', href: '#practice' }] },
          { title: 'Connect', links: [{ label: 'Email Nehul', href: 'mailto:hello@example.com' }, { label: 'Back to start', href: '#top' }] },
        ]}
      />
    </main>
  );
}

createRoot(document.getElementById('nehul-root')).render(<App />);

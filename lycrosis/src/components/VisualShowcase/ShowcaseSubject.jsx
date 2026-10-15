import { useEffect, useMemo, useState } from 'react';

const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0));

export function ShowcaseSubject({ subject, parallax, parallaxOffset, className = '' }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [subject.src]);
  const position = subject.position || {};
  const mobile = subject.mobilePosition || position;
  const style = useMemo(() => ({
    '--subject-x': `${clamp(position.x ?? 50, -40, 120)}%`, '--subject-y': `${clamp(position.y ?? 0, -40, 120)}%`,
    '--subject-w': `${clamp(position.width ?? 60, 5, 140)}%`, '--subject-h': `${clamp(position.height ?? 90, 5, 140)}%`,
    '--subject-scale': clamp(position.scale ?? 1, .1, 3), '--subject-rotate': `${clamp(position.rotation ?? 0, -180, 180)}deg`,
    '--subject-opacity': clamp(subject.opacity ?? 1, 0, 1), '--subject-z': subject.zIndex ?? 3,
    '--mobile-x': `${clamp(mobile.x ?? 50, -40, 120)}%`, '--mobile-y': `${clamp(mobile.y ?? 0, -40, 120)}%`,
    '--mobile-w': `${clamp(mobile.width ?? 70, 5, 140)}%`, '--mobile-h': `${clamp(mobile.height ?? 60, 5, 140)}%`,
    '--mobile-scale': clamp(mobile.scale ?? 1, .1, 3), '--mobile-rotate': `${clamp(mobile.rotation ?? 0, -180, 180)}deg`,
    '--parallax-y': parallax ? `${parallaxOffset}px` : '0px', '--subject-fit': subject.fit || 'contain', mixBlendMode: subject.blendMode || 'normal', background: subject.background || 'transparent'
  }), [subject, mobile, parallax, parallaxOffset]);

  if (subject.type === 'component' && subject.render) return <div className={`showcase-subject ${className}`} style={style}>{subject.render()}</div>;
  const media = subject.type === 'video'
    ? <video src={subject.src} autoPlay muted loop playsInline aria-label={subject.alt} onError={() => setFailed(true)} />
    : <img src={subject.src} alt={subject.alt || ''} onError={() => setFailed(true)} />;
  return <div className={`showcase-subject entrance-${subject.entrance || 'none'} ${className}`} style={style}>{failed ? <div className="subject-fallback" role="img" aria-label={subject.alt || 'Asset unavailable'}><span>Asset unavailable</span><small>Replace this subject in the editor</small></div> : media}</div>;
}

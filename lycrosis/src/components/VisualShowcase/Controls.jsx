const colorFields = [['background', 'Ground'], ['foreground', 'Ink'], ['accent', 'Accent']];
const positions = [['x', 'Horizontal'], ['y', 'Vertical'], ['width', 'Width'], ['scale', 'Scale'], ['rotation', 'Rotation'], ['opacity', 'Opacity']];

export function Controls({ config, presetId, onPreset, onChange, onReset, isOpen, onOpen }) {
  const subject = config.subject;
  const updateSubject = (key, value) => onChange({ subject: { ...subject, [key]: value } });
  const updatePosition = (key, value) => updateSubject('position', { ...subject.position, [key]: Number(value) });
  return <aside className={`control-dock ${isOpen ? 'is-open' : ''}`} aria-label="Showcase customizer">
    <button className="dock-toggle" onClick={() => onOpen(!isOpen)} aria-expanded={isOpen}>Customize <span>{isOpen ? '−' : '+'}</span></button>
    <div className="control-scroll">
      <div className="control-title"><h2>Art direction</h2><button onClick={onReset}>Restore preset</button></div>
      <label>Example preset<select value={presetId} onChange={(e) => onPreset(e.target.value)}><option value="lycoris">Lycoris</option><option value="transformers">Transformers</option><option value="product">Product editorial</option></select></label>
      <label>Layout<select value={config.layout} onChange={(e) => onChange({ layout: e.target.value })}>{['editorial','centered','split','immersive','specimen'].map((value) => <option key={value}>{value}</option>)}</select></label>
      <div className="control-pair"><label>Title<input value={config.title} onChange={(e) => onChange({ title: e.target.value })} /></label><label>Subtitle<input value={config.subtitle} onChange={(e) => onChange({ subtitle: e.target.value })} /></label></div>
      <label>Subject URL<input value={subject.src || ''} placeholder="/assets/object.png or https://…" onChange={(e) => updateSubject('src', e.target.value)} /></label>
      <div className="control-pair"><label>Fit<select value={subject.fit} onChange={(e) => updateSubject('fit', e.target.value)}>{['contain','cover','fill'].map(v => <option key={v}>{v}</option>)}</select></label><label>Entrance<select value={subject.entrance} onChange={(e) => updateSubject('entrance', e.target.value)}>{['none','fade','fade-up','scale-in','slide-in'].map(v => <option key={v}>{v}</option>)}</select></label></div>
      <fieldset><legend>Subject placement</legend>{positions.map(([key, label]) => <label className="range" key={key}>{label}<input type="range" min={key === 'scale' ? .3 : key === 'opacity' ? 0 : key === 'rotation' ? -25 : 0} max={key === 'scale' ? 1.8 : key === 'opacity' ? 1 : key === 'rotation' ? 25 : key === 'width' ? 100 : 100} step={key === 'scale' || key === 'opacity' ? .01 : 1} value={key === 'opacity' ? subject.opacity : subject.position?.[key] ?? (key === 'scale' ? 1 : 0)} onChange={(e) => key === 'opacity' ? updateSubject('opacity', Number(e.target.value)) : updatePosition(key, e.target.value)} /><output>{key === 'scale' || key === 'opacity' ? Number(key === 'opacity' ? subject.opacity : subject.position?.[key] ?? 1).toFixed(2) : `${subject.position?.[key] ?? 0}${key === 'rotation' ? '°' : '%'}`}</output></label>)}</fieldset>
      <fieldset><legend>Theme</legend><div className="color-grid">{colorFields.map(([key, label]) => <label key={key}><span>{label}</span><input type="color" value={config.theme[key]} onChange={(e) => onChange({ theme: { ...config.theme, [key]: e.target.value } })} /></label>)}</div></fieldset>
      <div className="control-pair"><label>Type<select value={config.typography.family} onChange={(e) => onChange({ typography: { ...config.typography, family: e.target.value } })}><option value="serif">Serif</option><option value="sans">Sans</option></select></label><label>Alignment<select value={config.typography.alignment} onChange={(e) => onChange({ typography: { ...config.typography, alignment: e.target.value } })}>{['left','center','right'].map(v=><option key={v}>{v}</option>)}</select></label></div>
      <label className="range">Typography scale<input type="range" min=".7" max="1.35" step=".01" value={config.typography.scale} onChange={(e) => onChange({ typography: { ...config.typography, scale: Number(e.target.value) } })} /><output>{config.typography.scale.toFixed(2)}</output></label>
      <label className="range">Motion intensity<input type="range" min="0" max="1" step=".05" value={config.animation.intensity} onChange={(e) => onChange({ animation: { ...config.animation, intensity: Number(e.target.value) } })} /><output>{config.animation.intensity.toFixed(2)}</output></label>
      <label className="toggle">Parallax<input type="checkbox" checked={config.animation.parallax} onChange={(e) => onChange({ animation: { ...config.animation, parallax: e.target.checked } })} /><span /></label>
    </div>
  </aside>;
}

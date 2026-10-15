import { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { clonePreset, validateShowcase } from './config/showcases';
import { VisualShowcase } from './components/VisualShowcase/VisualShowcase';
import './styles.css';

function App() {
  const [config, setConfig] = useState(() => clonePreset('lycoris'));
  const error = useMemo(() => validateShowcase(config), [config]);
  return <main id="top"><VisualShowcase config={config} error={error} /><section className="system-note"><p>One engine, many subjects.</p><span>Local and remote images · SVG · GIF · video · custom component slot</span></section></main>;
}
createRoot(document.getElementById('root')).render(<App />);

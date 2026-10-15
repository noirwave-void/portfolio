/** @typedef {'editorial'|'centered'|'split'|'immersive'|'specimen'} Layout */
/** @typedef {'image'|'video'|'component'} SubjectType */
/** @typedef {{x?:number,y?:number,width?:number,height?:number,scale?:number,rotation?:number}} ResponsivePosition */
/** @typedef {{type:SubjectType,src?:string,alt?:string,fit?:'contain'|'cover'|'fill',position?:ResponsivePosition,mobilePosition?:ResponsivePosition,opacity?:number,zIndex?:number,blendMode?:string,background?:string,entrance?:'none'|'fade'|'fade-up'|'scale-in'|'slide-in',render?:Function}} ShowcaseSubject */
/** @typedef {{background:string, foreground:string, muted:string, accent:string, panel:string}} ShowcaseTheme */
/** @typedef {{family:'serif'|'sans', scale:number, alignment:'left'|'center'|'right', display?:string}} ShowcaseTypography */
/** @typedef {{entrance:'none'|'fade'|'fade-up'|'scale-in'|'slide-in', parallax:boolean, intensity:number, duration:number}} ShowcaseAnimation */
/** @typedef {{id:string,label:string,layout:Layout,title:string,subtitle:string,description:string,metadata?:string[],subject:ShowcaseSubject,theme:ShowcaseTheme,typography:ShowcaseTypography,animation:ShowcaseAnimation}} ShowcaseConfig */

const noir = { background: '#080808', foreground: '#f1ede5', muted: '#a8a29a', accent: '#df1833', panel: '#151313' };

/** @type {Record<string, ShowcaseConfig>} */
export const showcasePresets = {
  lycoris: {
    id: 'lycoris', label: 'Lycoris', layout: 'specimen', title: 'LYCORIS', subtitle: 'A STUDY IN CRIMSON',
    description: 'A visual specimen where oversized type and a single bloom share the same, deliberate field.',
    metadata: ['TYPE SPECIMEN', 'NIGHT BLOOM', 'TOKYO / 2024'],
    subject: { type: 'image', src: '/assets/lycoris.svg', alt: 'Crimson spider lily illustration', fit: 'contain', position: { x: 54, y: 4, width: 47, height: 95, scale: 1, rotation: -3 }, mobilePosition: { x: 30, y: 29, width: 76, height: 60, scale: .9, rotation: -3 }, opacity: 1, zIndex: 3, blendMode: 'screen', entrance: 'scale-in' },
    theme: noir, typography: { family: 'serif', scale: 1, alignment: 'left', display: 'Playfair Display' }, animation: { entrance: 'fade-up', parallax: true, intensity: .42, duration: 900 }
  },
  transformers: {
    id: 'transformers', label: 'Transformers', layout: 'split', title: 'TRANSFORMERS', subtitle: 'MORE THAN MEETS THE EYE',
    description: 'A cinematic subject configuration for a large transparent render, staged against a dark editorial field.',
    metadata: ['SUBJECT / ROBOT', 'CONTAIN / 82%', 'RENDER STUDY'],
    subject: { type: 'image', src: '/assets/transformer.png', alt: 'Futuristic transformer robot render', fit: 'contain', position: { x: 51, y: 2, width: 49, height: 98, scale: 1, rotation: 0 }, mobilePosition: { x: 12, y: 34, width: 86, height: 58, scale: .88, rotation: 0 }, opacity: 1, zIndex: 3, blendMode: 'normal', entrance: 'slide-in' },
    theme: { ...noir, accent: '#ee3548', panel: '#101214' }, typography: { family: 'sans', scale: .88, alignment: 'left', display: 'Space Grotesk' }, animation: { entrance: 'fade-up', parallax: true, intensity: .3, duration: 850 }
  },
  product: {
    id: 'product', label: 'Product editorial', layout: 'immersive', title: 'NOCTURNE', subtitle: 'EXTRAIT DE PARFUM',
    description: 'A product composition with room for any cutout: fragrance, sneaker, watch, sculpture, or the object you are introducing.',
    metadata: ['50 ML', 'SMOKED GLASS', 'EDITION / 01'],
    subject: { type: 'image', src: '/assets/nocturne-bottle.png', alt: 'Smoked black fragrance bottle with crimson liquid', fit: 'contain', position: { x: 31, y: 5, width: 38, height: 91, scale: 1, rotation: -1 }, mobilePosition: { x: 24, y: 28, width: 60, height: 61, scale: .86, rotation: -1 }, opacity: 1, zIndex: 3, blendMode: 'normal', entrance: 'fade-up' },
    theme: { background: '#0c0a0a', foreground: '#f5ebe0', muted: '#afa29b', accent: '#be162c', panel: '#201517' }, typography: { family: 'serif', scale: 1.1, alignment: 'center', display: 'Playfair Display' }, animation: { entrance: 'scale-in', parallax: true, intensity: .18, duration: 1000 }
  }
};

export const clonePreset = (id) => structuredClone(showcasePresets[id]);

export function validateShowcase(config) {
  if (!config?.title?.trim()) return 'A title is required.';
  if (!config?.subject?.type) return 'Choose a subject type.';
  if (config.subject.type !== 'component' && !config.subject.src?.trim()) return 'Add an image, SVG, GIF, video, or remote asset URL.';
  return '';
}

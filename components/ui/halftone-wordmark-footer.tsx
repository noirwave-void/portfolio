"use client"

import * as React from "react"

export interface HalftonePalette {
  background: string
  ink: string
  warm: string
}

export type HalftonePreset = "night" | "paper" | "ember" | "cobalt"
export interface FooterLink { label: string; href?: string }
export interface FooterColumn { title: string; links: FooterLink[] }
export interface HalftoneWordmarkFooterProps {
  wordmark?: string
  label?: string
  meta?: string
  columns?: FooterColumn[]
  backToTop?: boolean
  preset?: HalftonePreset
  palette?: { background?: string; ink?: string; warm?: string }
  dotGap?: number
  radius?: number
  crop?: number
  grain?: number
  interactive?: boolean
  fontFamily?: string
  fontWeight?: number
  monoFamily?: string
  height?: string
  className?: string
}

const PRESETS: Record<HalftonePreset, HalftonePalette> = {
  night: { background: "#0c0c0b", ink: "#e9e4da", warm: "#e9762b" },
  paper: { background: "#efebe3", ink: "#17150f", warm: "#c2361c" },
  ember: { background: "#160a06", ink: "#f2c48c", warm: "#ff5a1f" },
  cobalt: { background: "#0d1b4d", ink: "#dfe7ff", warm: "#ffcd3c" },
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  { title: "Work", links: [{ label: "Index" }, { label: "Archive" }, { label: "Journal" }] },
  { title: "Studio", links: [{ label: "About" }, { label: "Process" }, { label: "Careers" }] },
  { title: "Contact", links: [{ label: "hello@halden.co" }, { label: "+47 22 00 41 00" }] },
]

const SANS_STACK = '"Inter Tight", "Inter Variable", "Inter", "Helvetica Neue", Arial, system-ui, sans-serif'
const MONO_STACK = '"JetBrains Mono", "SF Mono", ui-monospace, Menlo, Consolas, monospace'

export function hwfHex(hex: string): [number, number, number] | null {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || "").trim())
  if (!match) return null
  const value = match[1].length === 3 ? match[1].split("").map((char) => char + char).join("") : match[1]
  return [parseInt(value.slice(0, 2), 16), parseInt(value.slice(2, 4), 16), parseInt(value.slice(4, 6), 16)]
}

export function hwfRadius(coverage: number, gap: number) {
  const bounded = Math.max(0, Math.min(1, coverage))
  return Math.sqrt(bounded) * gap * 0.56
}

export function hwfStep(x: number, y: number, vx: number, vy: number, hx: number, hy: number, px: number, py: number, radius: number) {
  const dx = x - px
  const dy = y - py
  const distanceSquared = dx * dx + dy * dy
  if (radius > 0 && distanceSquared < radius * radius) {
    const distance = Math.sqrt(distanceSquared) + 0.001
    const force = (1 - distance / radius) * 2.6
    vx += (dx / distance) * force
    vy += (dy / distance) * force
  }
  vx = (vx + (hx - x) * 0.05) * 0.84
  vy = (vy + (hy - y) * 0.05) * 0.84
  return [x + vx, y + vy, vx, vy]
}

export function hwfWarmth(x: number, y: number, hx: number, hy: number, span: number) {
  const distance = Math.hypot(x - hx, y - hy)
  return span > 0 ? Math.min(1, distance / span) : 0
}

export function hwfFitSize(measured: number, width: number) {
  return measured > 0 ? (width / measured) * 100 : 0
}

const HWF_CSS = `
.hwf-root{position:relative;width:100%;overflow:hidden;isolation:isolate;background:var(--hwf-bg);color:var(--hwf-ink);-webkit-font-smoothing:antialiased}
.hwf-root canvas{position:absolute;inset:0;width:100%;height:100%;display:block;max-width:none}
.hwf-top{position:relative;z-index:1;display:grid;grid-template-columns:minmax(0,1.25fr) repeat(3,minmax(0,1fr));gap:24px;padding:clamp(22px,3.4vw,40px) clamp(20px,3.4vw,44px) 0;font-family:var(--hwf-mono);font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;line-height:1.75}
.hwf-brand strong{display:block;font-weight:500}.hwf-brand span{opacity:.55}.hwf-col h3{margin:0;font:inherit;opacity:.55;font-weight:500}.hwf-col ul{list-style:none;margin:0;padding:0}
.hwf-col a,.hwf-up{color:inherit;text-decoration:none;opacity:.84;background:none;border:0;padding:0;font:inherit;letter-spacing:inherit;text-transform:inherit;cursor:pointer;background-image:linear-gradient(currentColor,currentColor);background-size:0% 1px;background-repeat:no-repeat;background-position:0 100%;transition:opacity .25s ease,background-size .35s cubic-bezier(.2,.7,.1,1)}
.hwf-col a:hover,.hwf-up:hover{opacity:1;background-size:100% 1px}.hwf-col a:focus-visible,.hwf-up:focus-visible{outline:1px solid currentColor;outline-offset:3px;opacity:1}
.hwf-rule{position:relative;z-index:1;display:flex;justify-content:flex-end;align-items:center;gap:16px;margin:clamp(18px,2.6vw,30px) clamp(20px,3.4vw,44px) 0;padding-top:12px;border-top:.5px solid color-mix(in srgb,var(--hwf-ink) 24%,transparent);font-family:var(--hwf-mono);font-size:10.5px;letter-spacing:.18em;text-transform:uppercase}
.hwf-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
@media(max-width:720px){.hwf-top{grid-template-columns:minmax(0,1fr) minmax(0,1fr);row-gap:18px}.hwf-brand{grid-column:1/-1}}
@media(prefers-reduced-motion:reduce){.hwf-col a,.hwf-up{transition:none}}
`

type Dot = [number, number, number, number, number, number, number]

export default function HalftoneWordmarkFooter({
  wordmark = "halden", label = "Halden Studio", meta = "©2026 · Oslo / Lisbon", columns = DEFAULT_COLUMNS,
  backToTop = true, preset = "night", palette, dotGap = 6, radius = 80, crop = 0.2, grain = 0.5,
  interactive = true, fontFamily = SANS_STACK, fontWeight = 800, monoFamily = MONO_STACK, height = "560px", className = "",
}: HalftoneWordmarkFooterProps) {
  const colors = { ...PRESETS[preset], ...palette }
  const rootRef = React.useRef<HTMLElement | null>(null)
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const options = React.useRef({ colors, dotGap, radius, crop, grain, interactive, fontFamily, fontWeight, wordmark })
  options.current = { colors, dotGap, radius, crop, grain, interactive, fontFamily, fontWeight, wordmark }
  const key = [wordmark, dotGap, crop, grain, fontFamily, fontWeight, colors.background, colors.ink, colors.warm].join("|")

  React.useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!root || !canvas || !context) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let width = 0, heightPx = 0, dpr = 1, pointerX = -1e5, pointerY = -1e5, frame = 0
    let visible = true, awake = true, ring = { x: 0, y: 0, t: -1 }
    let dots: Dot[] = []
    let grainTile: HTMLCanvasElement | null = null
    const ink = hwfHex(options.current.colors.ink) || [233, 228, 218]
    const warm = hwfHex(options.current.colors.warm) || [233, 118, 43]

    const layout = () => {
      const opts = options.current
      const rect = root.getBoundingClientRect()
      width = Math.max(1, Math.round(rect.width)); heightPx = Math.max(1, Math.round(rect.height))
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(heightPx * dpr)
      const mask = document.createElement("canvas")
      mask.width = width; mask.height = heightPx
      const maskContext = mask.getContext("2d", { willReadFrequently: true })
      if (!maskContext) return
      maskContext.font = `${opts.fontWeight} 100px ${opts.fontFamily}`
      const text = opts.wordmark || " "
      const size = hwfFitSize(maskContext.measureText(text).width, width * 1.02)
      maskContext.font = `${opts.fontWeight} ${size}px ${opts.fontFamily}`
      const measured = maskContext.measureText(text)
      const cap = measured.actualBoundingBoxAscent || size * 0.72
      maskContext.fillStyle = "#000"; maskContext.textBaseline = "alphabetic"
      maskContext.fillText(text, (width - measured.width) / 2, heightPx + cap * Math.max(0, Math.min(0.6, opts.crop)))
      const pixels = maskContext.getImageData(0, 0, width, heightPx).data
      const gap = Math.max(3, opts.dotGap), cols = Math.ceil(width / gap), rows = Math.ceil(heightPx / gap)
      const next: Dot[] = []
      for (let gy = 0; gy < rows; gy++) for (let gx = 0; gx < cols; gx++) {
        let sum = 0
        for (let sy = 0; sy < 3; sy++) for (let sx = 0; sx < 3; sx++) {
          const x = Math.min(width - 1, Math.floor(gx * gap + ((sx + 0.5) * gap) / 3))
          const y = Math.min(heightPx - 1, Math.floor(gy * gap + ((sy + 0.5) * gap) / 3))
          sum += pixels[(y * width + x) * 4 + 3]
        }
        const coverage = sum / (9 * 255)
        if (coverage < 0.06) continue
        const hx = gx * gap + gap / 2, hy = gy * gap + gap / 2
        next.push([hx, hy, 0, 0, hx, hy, hwfRadius(coverage, gap)])
      }
      dots = next
      grainTile = document.createElement("canvas"); grainTile.width = 256; grainTile.height = 256
      const grainContext = grainTile.getContext("2d")
      if (grainContext) {
        const image = grainContext.createImageData(256, 256)
        for (let i = 0; i < image.data.length; i += 4) {
          const value = Math.random() * 255
          image.data[i] = image.data[i + 1] = image.data[i + 2] = value
          image.data[i + 3] = Math.random() < 0.5 ? 0 : 255
        }
        grainContext.putImageData(image, 0, 0)
      }
      awake = true
    }

    const draw = (now: number) => {
      const opts = options.current
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.fillStyle = opts.colors.background; context.fillRect(0, 0, width, heightPx)
      const pushRadius = opts.interactive && !reduced ? Math.max(0, opts.radius) : 0
      const ringAge = ring.t < 0 ? 1e9 : now - ring.t, ringRadius = ringAge * 0.9
      let moving = false
      for (const dot of dots) {
        let [x, y, vx, vy, hx, hy, size] = dot
        if (!reduced) {
          if (ringAge < 900) {
            const dx = hx - ring.x, dy = hy - ring.y, distance = Math.hypot(dx, dy) + 0.001
            const band = 1 - Math.min(1, Math.abs(distance - ringRadius) / 26)
            if (band > 0) { const force = band * 3.2 * (1 - ringAge / 900); vx += dx / distance * force; vy += dy / distance * force }
          }
          ;[x, y, vx, vy] = hwfStep(x, y, vx, vy, hx, hy, pointerX, pointerY, pushRadius)
          if (Math.abs(vx) + Math.abs(vy) > 0.02 || Math.abs(x - hx) + Math.abs(y - hy) > 0.05) moving = true
          else { x = hx; y = hy; vx = 0; vy = 0 }
          dot[0] = x; dot[1] = y; dot[2] = vx; dot[3] = vy
        }
        const warmth = hwfWarmth(x, y, hx, hy, 28)
        context.fillStyle = warmth > 0.02
          ? `rgb(${ink.map((base, index) => Math.round(base + (warm[index] - base) * warmth)).join(",")})`
          : opts.colors.ink
        context.beginPath(); context.arc(x, y, size, 0, Math.PI * 2); context.fill()
      }
      if (grainTile && opts.grain > 0) {
        context.globalAlpha = Math.min(1, opts.grain) * 0.09; context.globalCompositeOperation = "overlay"
        const pattern = context.createPattern(grainTile, "repeat")
        if (pattern) { context.fillStyle = pattern; context.fillRect(0, 0, width, heightPx) }
        context.globalAlpha = 1; context.globalCompositeOperation = "source-over"
      }
      awake = moving || ringAge < 900 || pointerX > -1e4
    }

    const loop = (now: number) => { frame = 0; if (!visible) return; draw(now); if (awake) frame = requestAnimationFrame(loop) }
    const wake = () => { awake = true; if (!frame && visible) frame = requestAnimationFrame(loop) }
    const local = (event: PointerEvent) => { const bounds = canvas.getBoundingClientRect(); return [event.clientX - bounds.left, event.clientY - bounds.top] }
    const onMove = (event: PointerEvent) => { if (!options.current.interactive) return; [pointerX, pointerY] = local(event); wake() }
    const onLeave = () => { pointerX = -1e5; pointerY = -1e5; wake() }
    const onDown = (event: PointerEvent) => {
      if (!options.current.interactive || reduced || (event.target as HTMLElement).closest("a,button")) return
      const [x, y] = local(event); ring = { x, y, t: performance.now() }; wake()
    }
    layout(); draw(performance.now()); wake()
    root.addEventListener("pointermove", onMove); root.addEventListener("pointerleave", onLeave); root.addEventListener("pointerdown", onDown)
    const resizeObserver = new ResizeObserver(() => { layout(); wake() }); resizeObserver.observe(root)
    const intersectionObserver = new IntersectionObserver((entries) => { visible = entries[0]?.isIntersecting ?? true; if (visible) wake() })
    intersectionObserver.observe(root)
    let alive = true
    document.fonts?.ready.then(() => { if (alive) { layout(); wake() } })
    return () => {
      alive = false; cancelAnimationFrame(frame); resizeObserver.disconnect(); intersectionObserver.disconnect()
      root.removeEventListener("pointermove", onMove); root.removeEventListener("pointerleave", onLeave); root.removeEventListener("pointerdown", onDown)
    }
  }, [key])

  return (
    <footer ref={rootRef} className={`hwf-root ${className}`} style={{ height, "--hwf-bg": colors.background, "--hwf-ink": colors.ink, "--hwf-mono": monoFamily } as React.CSSProperties}>
      <style>{HWF_CSS}</style>
      <canvas ref={canvasRef} aria-hidden="true" />
      <span className="hwf-sr">{wordmark}</span>
      <div className="hwf-top">
        <div className="hwf-brand"><strong>{label}</strong><span>{meta}</span></div>
        {columns.map((column) => <nav className="hwf-col" key={column.title} aria-label={column.title}><h3>{column.title}</h3><ul>{column.links.map((link) => <li key={link.label}><a href={link.href || "#"}>{link.label}</a></li>)}</ul></nav>)}
      </div>
      <div className="hwf-rule">{backToTop ? <button type="button" className="hwf-up" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Back to top ↑</button> : null}</div>
    </footer>
  )
}

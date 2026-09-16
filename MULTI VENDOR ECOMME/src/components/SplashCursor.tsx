import { useEffect, useRef } from "react"

// Lightweight canvas "splash" cursor: pointer motion emits soft, expanding
// colour blobs that fade out — a spatial/liquid accent layered over the whole
// app. Colours are read from the live Astra kit tokens so it restyles with the
// design system. Pointer events pass straight through.
type Blob = { x: number; y: number; r: number; life: number; max: number; hue: number }

export default function SplashCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const blobs: Blob[] = []
    let last = { x: 0, y: 0, t: 0 }
    let raf = 0

    // Read brand colours from CSS variables (fallback to lavender/purple).
    const styles = getComputedStyle(document.documentElement)
    const readColor = (name: string, fallback: string) => {
      const v = styles.getPropertyValue(name).trim()
      return v || fallback
    }
    const palette = [
      readColor("--brand-primary", "#5250f3"),
      readColor("--brand-secondary", "#8b8bff"),
      readColor("--brand-primary", "#5250f3"),
    ]

    function resize() {
      w = window.innerWidth
      h = window.innerHeight
      canvas!.width = w * dpr
      canvas!.height = h * dpr
      canvas!.style.width = w + "px"
      canvas!.style.height = h + "px"
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)

    function spawn(x: number, y: number, speed: number) {
      const count = Math.min(3, 1 + Math.floor(speed / 40))
      for (let i = 0; i < count; i++) {
        blobs.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          r: 6 + Math.random() * 10,
          life: 0,
          max: 46 + Math.random() * 34,
          hue: Math.floor(Math.random() * palette.length),
        })
      }
      if (blobs.length > 160) blobs.splice(0, blobs.length - 160)
    }

    function onMove(e: PointerEvent) {
      const now = performance.now()
      const dx = e.clientX - last.x
      const dy = e.clientY - last.y
      const dist = Math.hypot(dx, dy)
      if (dist > 4) {
        spawn(e.clientX, e.clientY, dist)
        last = { x: e.clientX, y: e.clientY, t: now }
      }
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerdown", (e) => spawn(e.clientX, e.clientY, 120))

    function frame() {
      ctx!.clearRect(0, 0, w, h)
      ctx!.globalCompositeOperation = "lighter"
      for (let i = blobs.length - 1; i >= 0; i--) {
        const b = blobs[i]
        b.life++
        const p = b.life / b.max
        if (p >= 1) {
          blobs.splice(i, 1)
          continue
        }
        const radius = b.r * (1 + p * 3)
        const alpha = (1 - p) * 0.28
        const g = ctx!.createRadialGradient(b.x, b.y, 0, b.x, b.y, radius)
        const color = palette[b.hue]
        g.addColorStop(0, hexA(color, alpha))
        g.addColorStop(1, hexA(color, 0))
        ctx!.fillStyle = g
        ctx!.beginPath()
        ctx!.arc(b.x, b.y, radius, 0, Math.PI * 2)
        ctx!.fill()
      }
      ctx!.globalCompositeOperation = "source-over"
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", onMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="mh-cursor-canvas" aria-hidden="true" />
}

// Convert a hex or rgb color string to an rgba() with the given alpha.
function hexA(color: string, alpha: number): string {
  if (color.startsWith("#")) {
    let hex = color.slice(1)
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("")
    const n = parseInt(hex, 16)
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
  }
  if (color.startsWith("rgb")) {
    const nums = color.match(/[\d.]+/g) ?? ["82", "80", "243"]
    return `rgba(${nums[0]}, ${nums[1]}, ${nums[2]}, ${alpha})`
  }
  return `rgba(82, 80, 243, ${alpha})`
}

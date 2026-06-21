"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

interface MermaidRendererProps {
  chart: string
}

export function MermaidRenderer({ chart }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function renderChart() {
      setLoading(true)
      setError("")

      try {
        const mermaid = (await import("mermaid")).default
        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "loose",
          fontFamily: "system-ui, sans-serif",
        })

        if (cancelled || !containerRef.current) return

        // 生成唯一ID
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2)}`

        // 使用 mermaid.render 生成 SVG
        const { svg } = await mermaid.render(id, chart)

        if (cancelled || !containerRef.current) return
        containerRef.current.innerHTML = svg
      } catch (err) {
        if (!cancelled) {
          console.error("Mermaid render error:", err)
          setError("思维导图渲染失败")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    renderChart()

    return () => {
      cancelled = true
    }
  }, [chart])

  if (error) {
    return (
      <div className="p-4 text-center text-sm text-gray-400">
        {error}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="mermaid-container w-full overflow-x-auto"
    />
  )
}

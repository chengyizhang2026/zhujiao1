"use client"

interface SvgRendererProps {
  svg: string
  className?: string
}

export function SvgRenderer({ svg, className = "" }: SvgRendererProps) {
  if (!svg || svg === "null") return null

  // Sanitize: only allow safe SVG tags
  const cleaned = svg
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")

  return (
    <div
      className={`bg-white rounded-lg border border-gray-100 p-2 flex items-center justify-center overflow-x-auto ${className}`}
      dangerouslySetInnerHTML={{ __html: cleaned }}
    />
  )
}

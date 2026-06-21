"use client"

import { DiagramRenderer } from "@/components/shared/DiagramRenderer"

export default function TestDiagramPage() {
  return (
    <div className="p-4 space-y-6 pb-20">
      <h1 className="text-xl font-bold">图形测试页</h1>

      <div className="bg-white rounded-xl border p-4">
        <h2 className="text-sm font-semibold mb-2">✅ 纯SVG（参考）</h2>
        <svg viewBox="0 0 200 200" width="200" height="200">
          <rect x="20" y="20" width="160" height="160" fill="#f5f5f5" stroke="black" strokeWidth="2" />
        </svg>
      </div>

      <div className="bg-white rounded-xl border p-4">
        <h2 className="text-sm font-semibold mb-2">🔧 DiagramRenderer - cube_net</h2>
        <DiagramRenderer params={{ type: "cube_net", grid: [[null, "上", null], ["左", "前", "右"], [null, "下", null]] }} />
      </div>

      <div className="bg-white rounded-xl border p-4">
        <h2 className="text-sm font-semibold mb-2">🔧 DiagramRenderer - triangle</h2>
        <DiagramRenderer params={{ type: "triangle", vertices: ["A", "B", "C"] }} />
      </div>

      <div className="bg-white rounded-xl border p-4">
        <h2 className="text-sm font-semibold mb-2">🔧 DiagramRenderer - number_line</h2>
        <DiagramRenderer params={{ type: "number_line", from: -3, to: 3, points: [{ value: -1, label: "A" }] }} />
      </div>
    </div>
  )
}

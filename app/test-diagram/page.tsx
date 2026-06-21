"use client"

import { DiagramRenderer } from "@/components/shared/DiagramRenderer"

export default function TestDiagramPage() {
  const tests = [
    {
      label: "十字展开图(new grid)",
      params: { type: "cube_net" as const, grid: [[null,"上",null],["左","前","右"],[null,"下",null],[null,"后",null]] },
    },
    {
      label: "T形展开图",
      params: { type: "cube_net" as const, grid: [["F"],["E","A","C"],["B"],["D"]] },
    },
    {
      label: "十字展开图(old faces)",
      params: { type: "cube_net" as const, faces: ["上","下","左","前","右","后"] },
    },
    {
      label: "三角形",
      params: { type: "triangle" as const, vertices: ["A","B","C"] },
    },
    {
      label: "数轴",
      params: { type: "number_line" as const, from: -3, to: 3, points: [{value: -1, label: "A"}, {value: 2, label: "B"}] },
    },
  ]

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">图形测试页</h1>
      {tests.map((t, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold mb-2">{t.label}</h2>
          <DiagramRenderer params={t.params} />
        </div>
      ))}
      <p className="text-xs text-gray-400 text-center pb-20">
        如果上面5个都能看到图形，说明渲染器正常，问题在数据传递。如果有空白，说明组件有bug。
      </p>
    </div>
  )
}

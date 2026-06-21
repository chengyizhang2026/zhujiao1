"use client"

// ============================================================
// 几何图形渲染引擎 — AI给参数，前端画图
// ============================================================

interface CubeNetParams {
  type: "cube_net"
  faces: string[] // 6个面的文字，顺序：上、下、左、前、右、后
}

interface NumberLineParams {
  type: "number_line"
  from: number
  to: number
  points?: { value: number; label: string }[]
}

interface TriangleParams {
  type: "triangle"
  vertices: string[] // ["A", "B", "C"]
  labels?: { side: string; label: string }[] // [{ side: "AB", label: "5cm" }]
}

interface AngleParams {
  type: "angle"
  vertex: string // "O"
  rays: string[] // ["A", "B"]
  angle?: string // "45°"
}

type DiagramParams = CubeNetParams | NumberLineParams | TriangleParams | AngleParams

// ============================================================
// 正方体展开图（11种中的十字形）
// ============================================================
function CubeNet({ faces }: CubeNetParams) {
  const cell = 56
  const gap = 2
  // 十字形展开图布局：
  //        [0]
  //   [1] [2] [3] [4]
  //        [5]
  const positions = [
    { x: 1, y: 0 }, // face 0 (上)
    { x: 0, y: 1 }, // face 1 (左)
    { x: 1, y: 1 }, // face 2 (前)
    { x: 2, y: 1 }, // face 3 (右)
    { x: 3, y: 1 }, // face 4 (最右)
    { x: 1, y: 2 }, // face 5 (下)
  ]

  const svgWidth = 4 * (cell + gap) + gap
  const svgHeight = 3 * (cell + gap) + gap

  return (
    <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full max-w-[240px] mx-auto">
      {positions.map((pos, i) => (
        <g key={i}>
          <rect
            x={pos.x * (cell + gap) + gap}
            y={pos.y * (cell + gap) + gap}
            width={cell}
            height={cell}
            fill="#f5f5f5"
            stroke="#333"
            strokeWidth="1.5"
            rx="2"
          />
          <text
            x={pos.x * (cell + gap) + gap + cell / 2}
            y={pos.y * (cell + gap) + gap + cell / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="14"
            fontWeight="bold"
            fill="#333"
          >
            {faces[i] || ""}
          </text>
        </g>
      ))}
    </svg>
  )
}

// ============================================================
// 数轴
// ============================================================
function NumberLine({ from, to, points }: NumberLineParams) {
  const width = 300
  const height = 60
  const padding = 30
  const range = to - from
  const getX = (val: number) => padding + ((val - from) / range) * (width - 2 * padding)

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[300px] mx-auto">
      <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#333" strokeWidth="1.5" />
      <polygon points={`${width - padding},${height / 2} ${width - padding - 8},${height / 2 - 4} ${width - padding - 8},${height / 2 + 4}`} fill="#333" />
      <line x1={getX(0)} y1={height / 2 - 8} x2={getX(0)} y2={height / 2 + 8} stroke="#333" strokeWidth="1.5" />
      <text x={getX(0)} y={height / 2 + 22} textAnchor="middle" fontSize="11" fill="#333">0</text>
      {points?.map((p, i) => (
        <g key={i}>
          <circle cx={getX(p.value)} cy={height / 2} r="4" fill="#4f46e5" />
          <text x={getX(p.value)} y={height / 2 - 12} textAnchor="middle" fontSize="11" fill="#4f46e5" fontWeight="bold">
            {p.label}
          </text>
        </g>
      ))}
      <text x={width - padding + 4} y={height / 2 + 4} fontSize="10" fill="#666">x</text>
    </svg>
  )
}

// ============================================================
// 三角形
// ============================================================
function Triangle({ vertices, labels }: TriangleParams) {
  const [A, B, C] = vertices || ["A", "B", "C"]
  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[200px] mx-auto">
      <polygon points="100,20 20,170 180,170" fill="#f5f5f5" stroke="#333" strokeWidth="2" />
      <text x="100" y="10" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#333">{A}</text>
      <text x="8" y="190" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#333">{B}</text>
      <text x="192" y="190" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#333">{C}</text>
      {labels?.map((l, i) => (
        <text key={i} x={100} y={100 + i * 18} textAnchor="middle" fontSize="11" fill="#666">
          {l.side} = {l.label}
        </text>
      ))}
    </svg>
  )
}

// ============================================================
// 角
// ============================================================
function AngleView({ vertex, rays, angle }: AngleParams) {
  return (
    <svg viewBox="0 0 200 150" className="w-full max-w-[200px] mx-auto">
      <line x1="40" y1="120" x2="100" y2="120" stroke="#333" strokeWidth="2" />
      <line x1="100" y1="120" x2="160" y2="30" stroke="#333" strokeWidth="2" />
      <circle cx="100" cy="120" r="4" fill="#333" />
      <text x="100" y="140" textAnchor="middle" fontSize="14" fontWeight="bold">{vertex}</text>
      <text x="25" y="118" fontSize="13">{rays?.[0]}</text>
      <text x="168" y="32" fontSize="13">{rays?.[1]}</text>
      {angle && <text x="120" y="108" fontSize="11" fill="#666">{angle}</text>}
      <path d="M 112,108 A 16,16 0 0,0 128,97" fill="none" stroke="#4f46e5" strokeWidth="1.5" />
    </svg>
  )
}

// ============================================================
// 主渲染器
// ============================================================
interface DiagramRendererProps {
  params: DiagramParams | string
  className?: string
}

export function DiagramRenderer({ params, className = "" }: DiagramRendererProps) {
  let diagram: DiagramParams
  if (typeof params === "string") {
    try { diagram = JSON.parse(params) } catch { return null }
  } else {
    diagram = params
  }

  return (
    <div className={`flex items-center justify-center p-2 ${className}`}>
      {diagram.type === "cube_net" && <CubeNet {...diagram} />}
      {diagram.type === "number_line" && <NumberLine {...diagram} />}
      {diagram.type === "triangle" && <Triangle {...diagram} />}
      {diagram.type === "angle" && <AngleView {...diagram} />}
    </div>
  )
}

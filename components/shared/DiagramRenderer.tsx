"use client"

// ============================================================
// 几何图形渲染引擎 — AI给参数，前端画图
// ============================================================

interface CubeNetParams {
  type: "cube_net"
  grid?: (string | null)[][] // 新格式：2D网格
  faces?: string[] // 旧格式：6个面的文字
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
// 正方体展开图 — 兼容grid和faces两种格式
// ============================================================
function CubeNet({ grid, faces }: CubeNetParams) {
  // 旧格式faces转换为默认十字网格
  if (!grid && faces && faces.length === 6) {
    grid = [
      [null, faces[0], null],
      [faces[1], faces[2], faces[3]],
      [null, faces[4], null],
      [null, faces[5], null],
    ]
  }
  if (!grid) return null

  // 统计非null单元格数（必须恰好6个面）
  const faceCount = grid.flat().filter((c) => c !== null && c !== undefined).length
  const valid = faceCount === 6

  const cellSize = 52
  const gap = 3
  const rows = grid.length
  const cols = Math.max(...grid.map((r) => r.length))

  const svgW = cols * (cellSize + gap) + gap
  const svgH = rows * (cellSize + gap) + gap

  return (
    <>
      {!valid && (
        <p className="text-xs text-red-500 text-center mb-1">⚠️ 展开图应有6个面，当前只有{faceCount}个</p>
      )}
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-[280px] mx-auto">
        {grid.map((row, ri) =>
          row.map((cell, ci) => {
            if (!cell) return null
            const x = ci * (cellSize + gap) + gap
            const y = ri * (cellSize + gap) + gap
            return (
              <g key={`${ri}-${ci}`}>
                <rect x={x} y={y} width={cellSize} height={cellSize} fill="#f5f5f5" stroke={valid ? "#333" : "red"} strokeWidth="1.5" rx="3" />
                <text x={x + cellSize / 2} y={y + cellSize / 2} textAnchor="middle" dominantBaseline="central" fontSize="15" fontWeight="bold" fill={valid ? "#333" : "red"}>
                  {cell}
                </text>
              </g>
            )
          })
        )}
      </svg>
    </>
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

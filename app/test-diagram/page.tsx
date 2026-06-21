export default function TestDiagramPage() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">SVG 测试</h1>

      <div className="bg-white rounded-xl border p-4">
        <h2 className="text-sm mb-2">纯SVG正方形</h2>
        <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="20" width="160" height="160" fill="#f5f5f5" stroke="black" strokeWidth="2" />
          <text x="100" y="105" textAnchor="middle" fontSize="20" fill="black">中</text>
        </svg>
      </div>

      <div className="bg-white rounded-xl border p-4">
        <h2 className="text-sm mb-2">纯SVG展开图</h2>
        <svg viewBox="0 0 250 200" width="250" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect x="80" y="10" width="50" height="50" fill="#f5f5f5" stroke="black" strokeWidth="2" />
          <text x="105" y="40" textAnchor="middle" fontSize="14" fill="black">上</text>
          <rect x="10" y="70" width="50" height="50" fill="#f5f5f5" stroke="black" strokeWidth="2" />
          <text x="35" y="100" textAnchor="middle" fontSize="14" fill="black">左</text>
          <rect x="70" y="70" width="50" height="50" fill="#f5f5f5" stroke="black" strokeWidth="2" />
          <text x="95" y="100" textAnchor="middle" fontSize="14" fill="black">前</text>
          <rect x="130" y="70" width="50" height="50" fill="#f5f5f5" stroke="black" strokeWidth="2" />
          <text x="155" y="100" textAnchor="middle" fontSize="14" fill="black">右</text>
          <rect x="80" y="130" width="50" height="50" fill="#f5f5f5" stroke="black" strokeWidth="2" />
          <text x="105" y="160" textAnchor="middle" fontSize="14" fill="black">下</text>
        </svg>
      </div>

      <p className="text-xs text-gray-400 text-center pb-20">
        看到两个图形了吗？
      </p>
    </div>
  )
}

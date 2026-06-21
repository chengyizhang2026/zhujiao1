"use client"

export default function WritingPage() {
  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="pt-4">
        <h1 className="text-xl font-bold text-gray-900">✍️ 写作练习</h1>
        <p className="text-sm text-gray-500 mt-1">每周1次 · AI批改反馈</p>
      </div>
      <div className="text-center py-16">
        <p className="text-gray-400 text-sm">AI将批改语法、用词、句式多样性</p>
        <p className="text-gray-400 text-xs mt-1">语法错误 → 自动收录到错题库</p>
      </div>
    </div>
  )
}

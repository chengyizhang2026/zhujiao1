"use client"

export default function ListeningPage() {
  return (
    <div className="p-4 space-y-4 pb-20">
      <div className="pt-4">
        <h1 className="text-xl font-bold text-gray-900">🎧 听力训练</h1>
        <p className="text-sm text-gray-500 mt-1">每周2-3次 · 浏览器TTS朗读</p>
      </div>
      <div className="text-center py-16">
        <p className="text-gray-400 text-sm">使用浏览器语音合成（Web Speech API）</p>
        <p className="text-gray-400 text-xs mt-1">听写 + 关键词填空 + 理解题</p>
      </div>
    </div>
  )
}

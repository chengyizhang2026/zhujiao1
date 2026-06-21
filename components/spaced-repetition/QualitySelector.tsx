"use client"

interface QualitySelectorProps {
  value: number | null
  onChange: (quality: number) => void
}

const QUALITY_OPTIONS = [
  { value: 0, label: "完全忘了", emoji: "😰", color: "bg-red-100 text-red-700 border-red-200" },
  { value: 1, label: "一点印象", emoji: "😣", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { value: 2, label: "很勉强", emoji: "😕", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { value: 3, label: "还行", emoji: "🙂", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: 4, label: "比较轻松", emoji: "😊", color: "bg-green-100 text-green-700 border-green-200" },
  { value: 5, label: "太简单了", emoji: "🤩", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
]

export function QualitySelector({ value, onChange }: QualitySelectorProps) {
  return (
    <div className="flex gap-1.5 flex-wrap justify-center">
      {QUALITY_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg border text-xs transition-all ${
            value === opt.value
              ? `${opt.color} ring-2 ring-offset-1`
              : "bg-white text-gray-400 border-gray-100 hover:border-gray-300"
          }`}
        >
          <span className="text-lg leading-none">{opt.emoji}</span>
          <span className="font-medium">{opt.label}</span>
        </button>
      ))}
    </div>
  )
}

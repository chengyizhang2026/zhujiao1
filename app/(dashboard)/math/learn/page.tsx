import { Suspense } from "react"
import { LearnContent } from "./learn-content"

export default function LearnPage() {
  return (
    <Suspense fallback={<div className="p-4 pt-12 text-center text-gray-500">加载中...</div>}>
      <LearnContent />
    </Suspense>
  )
}

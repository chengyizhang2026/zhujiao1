import { Suspense } from "react"
import { PracticeContent } from "./practice-content"

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="p-4 pt-12 text-center text-gray-500">加载中...</div>}>
      <PracticeContent />
    </Suspense>
  )
}

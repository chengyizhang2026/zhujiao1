"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Languages, FileX, BarChart3 } from "lucide-react"

const NAV_ITEMS = [
  { key: "dashboard", label: "首页", href: "/dashboard", icon: Home },
  { key: "math", label: "数学", href: "/math", icon: BookOpen },
  { key: "english", label: "英语", href: "/english", icon: Languages },
  { key: "mistakes", label: "错题本", href: "/mistakes", icon: FileX },
  { key: "reports", label: "报告", href: "/reports", icon: BarChart3 },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 safe-area-bottom z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors ${
                isActive
                  ? "text-indigo-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

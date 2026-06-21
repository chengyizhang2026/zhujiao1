"use client"

import { BookOpen, Languages, FileX, BarChart3, Zap, Clock } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="p-4 space-y-6">
      {/* 头部 */}
      <div className="pt-4">
        <h1 className="text-xl font-bold text-gray-900">
          早上好！<span className="text-indigo-600">同学</span> ☀️
        </h1>
        <p className="text-sm text-gray-500 mt-1">今天也要加油哦！</p>
      </div>

      {/* 快捷开始 */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/math"
          className="p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
        >
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm">数学</h3>
          <p className="text-xs text-gray-400 mt-0.5">北师大版 · 七年级上</p>
        </Link>

        <Link
          href="/english"
          className="p-4 bg-white rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-sm transition-all"
        >
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-2">
            <Languages className="w-4 h-4 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm">英语</h3>
          <p className="text-xs text-gray-400 mt-0.5">外研版 · 七年级上</p>
        </Link>
      </div>

      {/* 今日任务 */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          今日任务
        </h2>

        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">复习旧错题</p>
              <p className="text-xs text-gray-400">3道错题等待复习</p>
            </div>
            <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full font-medium">
              待完成
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">今日学习</p>
              <p className="text-xs text-gray-400">选择一个科目开始学习</p>
            </div>
            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
              新内容
            </span>
          </div>
        </div>
      </div>

      {/* 数据概要 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-2xl font-bold text-indigo-600">12</p>
          <p className="text-xs text-gray-400 mt-0.5">本周学习次数</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-2xl font-bold text-red-500">5</p>
          <p className="text-xs text-gray-400 mt-0.5">活跃错题</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-2xl font-bold text-green-500">78%</p>
          <p className="text-xs text-gray-400 mt-0.5">正确率</p>
        </div>
      </div>
    </div>
  )
}

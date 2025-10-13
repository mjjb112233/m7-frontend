"use client"

import { useState, useEffect, useCallback } from "react"
import { AnnouncementBanner } from "./announcement-banner"
import { getAnnouncements, dismissAnnouncement, clearAnnouncementCache, type Announcement } from "@/lib/announcement-service"

interface DynamicAnnouncementProps {
  position?: "top" | "hero" | "floating"
  maxCount?: number
  autoRotate?: boolean
  rotateInterval?: number
  forceRefresh?: boolean // 是否强制刷新公告数据
}

export function DynamicAnnouncement({
  position = "top",
  maxCount = 3,
  autoRotate = true,
  rotateInterval = 5000,
  forceRefresh = false,
}: DynamicAnnouncementProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  const fetchAnnouncements = useCallback(async () => {
    try {
      console.log("[v0] 开始获取公告，位置:", position, "强制刷新:", forceRefresh)
      setError(null)

      // 如果需要强制刷新，先清除缓存
      if (forceRefresh) {
        clearAnnouncementCache()
      }

      const response = await getAnnouncements({
        position: "top",
        limit: maxCount,
      })

      if (response.success) {
        console.log("[v0] 获取到公告数量:", response.data.length)
        setAnnouncements(response.data)
        // 如果当前索引超出范围，重置为0
        if (currentIndex >= response.data.length) {
          setCurrentIndex(0)
        }
      } else {
        setError(response.message || "获取公告失败")
        setAnnouncements([])
      }
    } catch (error) {
      console.error("[v0] 获取公告异常:", error)
      setError("无法获取公告数据，请检查网络连接或稍后重试")
      setAnnouncements([])
    } finally {
      setLoading(false)
    }
  }, [position, maxCount, currentIndex, forceRefresh])

  useEffect(() => {
    fetchAnnouncements()
  }, [position, maxCount, forceRefresh])

  useEffect(() => {
    // 清除之前的定时器
    if (intervalId) {
      console.log("[v0] 清除之前的自动轮播定时器")
      clearInterval(intervalId)
      setIntervalId(null)
    }

    if (autoRotate && announcements.length > 1) {
      const currentAnnouncement = announcements[currentIndex]
      const duration = currentAnnouncement?.carouselDuration || rotateInterval

      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % announcements.length
          console.log("[v0] 自动切换公告，从", prevIndex, "到", nextIndex)
          setIsAnimating(true)
          setTimeout(() => setIsAnimating(false), 500) // 动画持续500ms
          return nextIndex
        })
      }, duration)

      setIntervalId(interval)
      console.log("[v0] 设置新的自动轮播定时器")

      return () => {
        console.log("[v0] 清除自动轮播定时器")
        clearInterval(interval)
        setIntervalId(null)
      }
    }
  }, [announcements, autoRotate, rotateInterval])

  // 页面卸载时清除缓存
  useEffect(() => {
    return () => {
      console.log("[v0] 组件卸载，清除公告缓存")
      clearAnnouncementCache()
    }
  }, [])

  const handleDismissAnnouncement = useCallback(
    (announcementId: string) => {
      console.log("[v0] 处理公告关闭:", announcementId)

      try {
        const result = dismissAnnouncement(announcementId)
        // 公告关闭成功，从列表中移除
        setAnnouncements((prev) => {
          const newAnnouncements = prev.filter((ann) => ann.id !== announcementId)

          // 如果当前显示的公告被关闭，调整索引
          if (currentIndex >= newAnnouncements.length && newAnnouncements.length > 0) {
            setCurrentIndex(0)
          } else if (newAnnouncements.length === 0) {
            setCurrentIndex(0)
          }

          // 如果公告数量变为0或1，清除定时器
          if (newAnnouncements.length <= 1 && intervalId) {
            console.log("[v0] 公告数量不足，清除定时器")
            clearInterval(intervalId)
            setIntervalId(null)
          }

          return newAnnouncements
        })
      } catch (error) {
        console.error("[v0] 关闭公告失败:", error)
      }
    },
    [currentIndex, intervalId],
  )

  // 如果有错误，显示错误信息
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg min-h-[60px] flex items-center">
        <p className="text-red-600 text-sm flex-1">获取公告失败: {error}</p>
        <button onClick={fetchAnnouncements} className="ml-2 text-sm text-red-700 hover:text-red-800 underline">
          重试
        </button>
      </div>
    )
  }

  // 如果没有公告，不显示任何内容
  if (announcements.length === 0) {
    console.log("[v0] 没有可显示的公告")
    return null
  }

  const currentAnnouncement = announcements[currentIndex]
  console.log("[v0] 当前显示公告:", currentAnnouncement?.id, "索引:", currentIndex)

  return (
    <div className="relative overflow-hidden">
      <div
        className={`transform transition-all duration-500 ease-in-out ${
          isAnimating ? "translate-x-0 opacity-100" : "translate-x-0 opacity-100"
        }`}
        style={{
          animation: isAnimating ? "slideInFromRight 0.5s ease-in-out" : "none",
        }}
      >
        <AnnouncementBanner
          type={currentAnnouncement.uiType}
          title={currentAnnouncement.title}
          message={currentAnnouncement.message}
          dismissible={currentAnnouncement.dismissible}
          position={currentAnnouncement.position}
          onDismiss={() => handleDismissAnnouncement(currentAnnouncement.id)}
        />
      </div>

      <style jsx>{`
        @keyframes slideInFromRight {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

import * as Portal from "@radix-ui/react-portal"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState, useRef } from "react"

import { useCensusEmbedded } from "@providers/CensusEmbeddedProvider"

export default function DevModeHoverCardManager() {
  const { devMode } = useCensusEmbedded()
  const [hoverTarget, setHoverTarget] = useState(null)
  const [hoverData, setHoverData] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 })
  const cardRef = useRef(null)
  const hideTimeoutRef = useRef(null)
  const showTimeoutRef = useRef(null)
  const isMouseOverCardRef = useRef(false)
  const isMouseOverTargetRef = useRef(false)
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = () => {
      setIsVisible(false)

      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = null
      }

      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current)
        showTimeoutRef.current = null
      }
    }

    router.events.on("routeChangeStart", handleRouteChange)

    return () => {
      router.events.off("routeChangeStart", handleRouteChange)
    }
  }, [router])

  useEffect(() => {
    if (!devMode) return

    const handleMouseOver = (e) => {
      let target = e.target
      while (target && !target.dataset.devMode) {
        target = target.parentElement
      }

      if (target && target.dataset.devMode) {
        try {
          if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current)
            hideTimeoutRef.current = null
          }

          if (showTimeoutRef.current) {
            clearTimeout(showTimeoutRef.current)
          }

          isMouseOverTargetRef.current = true

          const data = JSON.parse(target.dataset.devMode)
          setHoverTarget(target)
          setHoverData(data)

          const rect = target.getBoundingClientRect()
          setPosition({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height,
          })

          showTimeoutRef.current = setTimeout(() => {
            setIsVisible(true)
            showTimeoutRef.current = null
          }, 300)
        } catch (error) {}
      }
    }

    const handleMouseOut = (e) => {
      let target = e.target
      while (target && !target.dataset.devMode) {
        target = target.parentElement
      }

      if (target && target.dataset.devMode) {
        isMouseOverTargetRef.current = false

        if (showTimeoutRef.current) {
          clearTimeout(showTimeoutRef.current)
          showTimeoutRef.current = null
        }

        hideTimeoutRef.current = setTimeout(() => {
          if (!isMouseOverCardRef.current && !isMouseOverTargetRef.current) {
            setIsVisible(false)
          }
          hideTimeoutRef.current = null
        }, 100)
      }
    }

    const handleDocumentClick = (e) => {
      if (cardRef.current && cardRef.current.contains(e.target)) {
        return
      }

      if (hoverTarget && hoverTarget.contains(e.target)) {
        setIsVisible(false)
      }
    }

    document.addEventListener("mouseover", handleMouseOver)
    document.addEventListener("mouseout", handleMouseOut)
    document.addEventListener("click", handleDocumentClick)

    return () => {
      document.removeEventListener("mouseover", handleMouseOver)
      document.removeEventListener("mouseout", handleMouseOut)
      document.removeEventListener("click", handleDocumentClick)

      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }

      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current)
      }
    }
  }, [devMode, hoverTarget])

  const handleCardMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    isMouseOverCardRef.current = true
  }

  const handleCardMouseLeave = () => {
    isMouseOverCardRef.current = false

    hideTimeoutRef.current = setTimeout(() => {
      if (!isMouseOverTargetRef.current && !isMouseOverCardRef.current) {
        setIsVisible(false)
      }
      hideTimeoutRef.current = null
    }, 100)
  }

  const calculateCardPosition = () => {
    if (!hoverTarget) return { top: 0, left: 0 }

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let top = position.top + position.height + 5
    let left = position.left

    if (cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect()

      if (left + cardRect.width > viewportWidth) {
        left = Math.max(0, viewportWidth - cardRect.width)
      }

      if (top + cardRect.height > viewportHeight + window.scrollY) {
        top = position.top - cardRect.height - 5
      }
    }

    return { top, left }
  }

  if (!devMode || !isVisible || !hoverData) return null

  const cardPosition = calculateCardPosition()

  return (
    <Portal.Root>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={cardRef}
            className="fixed z-[9999] flex w-[450px] flex-col gap-2 rounded-md border border-neutral-100 bg-white p-4 font-mono text-sm shadow-lg "
            style={{
              top: `${cardPosition.top}px`,
              left: `${cardPosition.left}px`,
            }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            onMouseEnter={handleCardMouseEnter}
            onMouseLeave={handleCardMouseLeave}
          >
            <span className="font-medium text-[#4640EB]">Census Dev Mode</span>
            {hoverData.url && (
              <div className="flex flex-row items-center justify-between gap-1 text-xs leading-tight">
                <span className="shrink-0 items-center  font-bold uppercase text-neutral-500">
                  Request URL
                </span>{" "}
                <div className="truncate rounded border border-neutral-900 bg-neutral-800 px-2 py-1.5 text-neutral-400">
                  {hoverData.url}
                </div>
              </div>
            )}
            {hoverData.method && (
              <p>
                <span className="font-bold">Request Method:</span> {hoverData.method}
              </p>
            )}
            {hoverData.headers && (
              <p>
                <span className="font-bold">Request Headers:</span> {hoverData.headers}
              </p>
            )}
            {hoverData.body && (
              <p>
                <span className="font-bold">Request Body:</span> {hoverData.body}
              </p>
            )}
            {hoverData.note && <p>{hoverData.note}</p>}
            {hoverData.link && (
              <button className=" w-full rounded bg-neutral-800 p-2">
                <Link href={hoverData.link} target="_blank" rel="noreferrer">
                  <span className="font-bold">Documentation</span>
                </Link>
              </button>
            )}
            <div className="bg-brand-development absolute inset-0 -z-0 h-full w-full" />
          </motion.div>
        )}
      </AnimatePresence>
    </Portal.Root>
  )
}

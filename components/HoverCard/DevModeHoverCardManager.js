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
    let left = position.left - 2

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

  const calculateLabelPosition = () => {
    if (!hoverTarget) return { top: 0, left: 0 }

    const rect = hoverTarget.getBoundingClientRect()

    const top = rect.top + window.scrollY - 25
    const left = rect.left + window.scrollX - 1

    return { top, left }
  }

  const applyHighlightToTarget = (target) => {
    if (!target) return

    const originalOutline = target.style.outline
    const originalOutlineOffset = target.style.outlineOffset

    target.style.outline = "0.025rem dashed #4640EB"
    target.style.outlineOffset = "0.05rem"
    target.style.animation = "devmode-pulse 2s infinite"
    target.style.borderRadius = "0.05rem"

    return () => {
      target.style.outline = originalOutline
      target.style.outlineOffset = originalOutlineOffset
    }
  }

  useEffect(() => {
    if (isVisible && hoverTarget) {
      const removeHighlight = applyHighlightToTarget(hoverTarget)

      return () => {
        removeHighlight()
      }
    }
  }, [isVisible, hoverTarget])

  if (!devMode || !isVisible || !hoverData || !hoverTarget) return null

  const cardPosition = calculateCardPosition()
  const labelPosition = calculateLabelPosition()

  const getElementType = () => {
    if (!hoverTarget) return "Element"

    if (hoverData.elementType) return hoverData.elementType

    if (hoverTarget.classList.contains("btn") || hoverTarget.classList.contains("button")) {
      return "Button"
    }

    if (hoverTarget.tagName === "BUTTON") return "Button"
    if (hoverTarget.tagName === "A") return "Link"
    if (hoverTarget.tagName === "INPUT")
      return hoverTarget.type.charAt(0).toUpperCase() + hoverTarget.type.slice(1)
    if (hoverTarget.tagName === "SELECT") return "Select"

    return hoverTarget.tagName.toLowerCase()
  }

  const copyToClipboard = (text) => {
    if (!text) return

    try {
      navigator.clipboard.writeText(text).then(
        () => {},
        (err) => {},
      )
    } catch (err) {}
  }

  const infoItems = [
    { key: "url", label: "URL", value: hoverData.url, copiable: true },
    { key: "method", label: "Method", value: hoverData.method },
    { key: "headers", label: "Headers", value: hoverData.headers },
    { key: "body", label: "Body", value: hoverData.body, copiable: true },
  ].filter((item) => item.value)

  return (
    <Portal.Root>
      <AnimatePresence>
        {isVisible && (
          <>
            <motion.div
              className="fixed z-[9999] flex flex-row gap-2 rounded-sm bg-[#4640EB] px-1.5 py-0.5 font-mono text-xs font-medium text-white shadow-sm"
              style={{
                top: `${labelPosition.top}px`,
                left: `${labelPosition.left}px`,
                pointerEvents: "none",
              }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.07 }}
            >
              <span className="font-bold">{hoverData.method}</span>

              <span>{hoverData.url}</span>
            </motion.div>

            <motion.div
              ref={cardRef}
              className="fixed z-[9999] flex w-[450px] flex-col gap-2 overflow-hidden rounded-md border border-[#4640EB]/10 bg-white p-4 font-mono text-sm shadow-md shadow-[#4640EB]/10"
              style={{
                top: `${cardPosition.top}px`,
                left: `${cardPosition.left}px`,
                pointerEvents: "auto",
              }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.07 }}
              onMouseEnter={handleCardMouseEnter}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className="relative z-10 flex flex-col gap-2">
                <div className="flex flex-col gap-2 leading-none">
                  {hoverData.note && <p>{hoverData.note}</p>}
                </div>
                <div className="my-2 flex h-px w-full flex-col bg-neutral-100" />
                {infoItems.map((item) => (
                  <div
                    key={item.key}
                    className="flex w-full flex-row items-center gap-3 text-xs leading-tight"
                  >
                    <span className="shrink-0 items-center font-bold uppercase text-[#4640EB]">
                      {item.label}
                    </span>{" "}
                    <div className="flex flex-row items-center gap-2 rounded border border-neutral-100 bg-neutral-50 pl-1.5 text-neutral-600">
                      <span className="shrink truncate">{item.value}</span>
                      {item.copiable && (
                        <button
                          onClick={() => copyToClipboard(item.value)}
                          className="shrink-0 p-1.5 hover:bg-neutral-100"
                        >
                          <i className="fa-solid fa-clone leading-none text-neutral-500 " />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {hoverData.link && (
                  <Link href={hoverData.link} target="_blank" rel="noreferrer" className="cursor-pointer">
                    <button className=" w-full rounded border border-neutral-100 bg-white p-2 shadow">
                      <span className="font-bold">Documentation</span>
                    </button>
                  </Link>
                )}
              </div>
              <div className="bg-brand-development absolute inset-0 -z-0 h-full w-full" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Portal.Root>
  )
}

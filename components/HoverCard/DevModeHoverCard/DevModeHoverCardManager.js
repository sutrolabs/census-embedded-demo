import * as Portal from "@radix-ui/react-portal"
import { AnimatePresence } from "motion/react"
import { useRouter } from "next/router"
import { useEffect, useState, useRef } from "react"

import DevModeHoverCard from "@components/HoverCard/DevModeHoverCard/DevModeHoverCardComponents/DevModeHoverCard"
import DevModeHoverCardLabel from "@components/HoverCard/DevModeHoverCard/DevModeHoverCardComponents/DevModeHoverCardLabel"
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

    const rect = target.getBoundingClientRect()
    const highlightEl = document.createElement("div")

    highlightEl.style.position = "fixed"
    highlightEl.style.top = `${rect.top}px`
    highlightEl.style.left = `${rect.left}px`
    highlightEl.style.width = `${rect.width}px`
    highlightEl.style.height = `${rect.height}px`
    highlightEl.style.border = "0.025rem dashed #4640EB"
    highlightEl.style.borderRadius = "0.05rem"
    highlightEl.style.pointerEvents = "none"
    highlightEl.style.zIndex = "9998"
    highlightEl.style.animation = "devmode-pulse 2s infinite"

    document.body.appendChild(highlightEl)

    return () => {
      highlightEl.remove()
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

  return (
    <Portal.Root>
      <AnimatePresence>
        {isVisible && (
          <>
            <DevModeHoverCardLabel
              top={labelPosition.top}
              left={labelPosition.left}
              method={hoverData.method}
              url={hoverData.url}
            />
            <DevModeHoverCard
              top={cardPosition.top}
              left={cardPosition.left}
              onMouseEnter={handleCardMouseEnter}
              onMouseLeave={handleCardMouseLeave}
              hoverData={hoverData}
              ref={cardRef}
            />
          </>
        )}
      </AnimatePresence>
    </Portal.Root>
  )
}

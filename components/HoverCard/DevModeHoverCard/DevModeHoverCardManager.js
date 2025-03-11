import {
  useFloating,
  useInteractions,
  useHover,
  useDismiss,
  offset,
  flip,
  shift,
  autoUpdate,
  computePosition,
} from "@floating-ui/react"
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
  const [labelPosition, setLabelPosition] = useState(null)
  const labelRef = useRef(null)
  const router = useRouter()

  // Use Floating UI's hooks for card positioning and interactions
  const { x, y, strategy, refs, context, middlewareData, isPositioned, placement } = useFloating({
    open: !!hoverTarget,
    onOpenChange: (open) => {
      if (!open) {
        setHoverTarget(null)
        setHoverData(null)
      }
    },
    middleware: [
      offset(10),
      flip({
        padding: 10,
        fallbackPlacements: ["top-start"],
        fallbackStrategy: "bestFit",
      }),
      shift({ padding: 10 }),
    ],
    placement: "bottom-start",
    whileElementsMounted: autoUpdate,
  })

  // Setup hover interactions
  const hover = useHover(context, {
    delay: { open: 300, close: 100 },
    restMs: 40,
  })

  // Setup dismiss interactions (clicking outside)
  const dismiss = useDismiss(context)

  // Combine all interactions
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, dismiss])

  useEffect(() => {
    const handleRouteChange = () => {
      setHoverTarget(null)
      setHoverData(null)
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
          const data = JSON.parse(target.dataset.devMode)

          // Set the reference element for Floating UI
          refs.setReference(target)
          setHoverTarget(target)
          setHoverData(data)

          // Position the label separately
          if (labelRef.current) {
            computePosition(target, labelRef.current, {
              placement: "top-start",
              middleware: [offset(5), shift({ padding: 10 })],
            }).then(({ x, y }) => {
              setLabelPosition({ x, y })
            })
          }
        } catch (error) {}
      }
    }

    document.addEventListener("mouseover", handleMouseOver)
    return () => {
      document.removeEventListener("mouseover", handleMouseOver)
    }
  }, [devMode, refs])

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
    if (hoverTarget) {
      const removeHighlight = applyHighlightToTarget(hoverTarget)
      return () => {
        removeHighlight()
      }
    }
  }, [hoverTarget])

  if (!devMode || !hoverData || !hoverTarget) return null

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
        {hoverTarget && hoverData && (
          <>
            <DevModeHoverCardLabel
              ref={labelRef}
              style={{
                position: "absolute",
                top: labelPosition ? `${labelPosition.y}px` : "0",
                left: labelPosition ? `${labelPosition.x}px` : "0",
                opacity: labelPosition ? 1 : 0,
              }}
              method={hoverData.method}
              url={hoverData.url}
            />
            <DevModeHoverCard
              ref={refs.setFloating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                opacity: isPositioned ? 1 : 0,
              }}
              {...getFloatingProps()}
              hoverData={hoverData}
            />
          </>
        )}
      </AnimatePresence>
    </Portal.Root>
  )
}

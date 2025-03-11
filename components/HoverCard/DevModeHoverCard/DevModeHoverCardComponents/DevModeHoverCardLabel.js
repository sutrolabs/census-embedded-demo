import { motion } from "motion/react"
import { forwardRef } from "react"

const DevModeHoverCardLabel = forwardRef(({ style, method, url }, ref) => {
  return (
    <motion.div
      className="fixed z-[9999] flex flex-row gap-2 rounded-sm bg-[#4640EB] px-1.5 py-0.5 font-mono text-xs font-medium text-white shadow-sm"
      ref={ref}
      style={{
        ...style,
        pointerEvents: "none",
      }}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.07 }}
    >
      <span className="font-bold">{method}</span>
      <span>{url}</span>
    </motion.div>
  )
})

DevModeHoverCardLabel.displayName = "DevModeHoverCardLabel"

export default DevModeHoverCardLabel

import { useState } from "react"

export function Tag({ className, text, indicator, indicatorClassName, ...props }) {
  const [currentText, setCurrentText] = useState(text)
  return (
    <span
      style={{ ["--tw-text-opacity"]: currentText === text ? "1" : "0.8" }}
      className={`flex flex-row items-center gap-1.5 overflow-hidden rounded-full px-2.5 py-1 text-sm leading-tight transition duration-200 ${className}`}
      onTransitionEnd={() => {
        setCurrentText(text)
      }}
      {...props}
    >
      {indicator && <div className={`h-2 w-2 shrink-0 rounded-full ${indicatorClassName}`} />}
      <span className="w-full truncate">{currentText}</span>
    </span>
  )
}

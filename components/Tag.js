import { useState } from "react"

export function Tag({ className, text }) {
  const [currentText, setCurrentText] = useState(text)
  return (
    <span
      style={{ ["--tw-text-opacity"]: currentText === text ? "1" : "0.8" }}
      className={`rounded-full px-3 py-2 text-xs font-medium transition duration-200 ${className}`}
      onTransitionEnd={() => {
        setCurrentText(text)
      }}
    >
      {currentText}
    </span>
  )
}

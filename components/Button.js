import { forwardRef } from "react"

function Button({ solid, autoFocus, disabled, className, onClick, children }, ref) {
  return (
    <button
      className={`
        rounded-md border
        border-indigo-500 bg-indigo-50/50
        px-3 py-1
        text-indigo-700 shadow-sm
        transition
        enabled:hover:bg-indigo-100/50 enabled:hover:text-indigo-600
        disabled:border-stone-300 disabled:text-stone-300
        data-[solid]:border-indigo-700 data-[solid]:bg-indigo-700 data-[solid]:text-stone-50
        data-[solid]:enabled:hover:border-indigo-600 data-[solid]:enabled:hover:bg-indigo-600 data-[solid]:enabled:hover:text-stone-50
        data-[solid]:disabled:border-stone-400 data-[solid]:disabled:bg-stone-400
        ${className}
      `}
      data-solid={solid ? "" : null}
      autoFocus={autoFocus}
      disabled={disabled}
      onClick={onClick}
      ref={ref}
    >
      {children}
    </button>
  )
}

export default forwardRef(Button)

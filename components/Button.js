import { forwardRef } from "react"

function Button({ solid, autoFocus, emphasize, disabled, className, onClick, children }, ref) {
  return (
    <button
      className={`
        rounded-md border
        border-emerald-500 bg-emerald-50/50
        px-3 py-1
        text-emerald-700 shadow-sm
        transition
        enabled:hover:bg-emerald-100/50 enabled:hover:text-emerald-600
        disabled:border-neutral-300 disabled:text-neutral-300
        data-[solid]:border-emerald-700 data-[solid]:bg-emerald-700 data-[solid]:text-neutral-50
        data-[solid]:enabled:hover:border-emerald-600 data-[solid]:enabled:hover:bg-emerald-600 data-[solid]:enabled:hover:text-neutral-50
        data-[solid]:disabled:border-neutral-400 data-[solid]:disabled:bg-neutral-400
        ${className}
        ${emphasize ? "relative inline-flex items-center justify-center overflow-hidden hover:scale-105" : ""}
      `}
      data-solid={solid ? "" : null}
      autoFocus={autoFocus}
      disabled={disabled}
      onClick={onClick}
      ref={ref}
    >
      <span className="relative z-10">{children}</span>
      {emphasize && (
        // eslint-disable-next-line tailwindcss/enforces-negative-arbitrary-values
        <div class="absolute inset-0 -top-[20px] flex h-[calc(100%+40px)] w-full animate-[shine-infinite_4s_ease-in-out_infinite] justify-center blur-[12px]">
          <div class={`relative h-full w-8 lg:w-12 ${solid ? "bg-white/30" : "bg-emerald-500/30"}`}></div>
        </div>
      )}
    </button>
  )
}

export default forwardRef(Button)

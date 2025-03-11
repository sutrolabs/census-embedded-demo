import { forwardRef } from "react"

function Button(
  { solid, brand, autoFocus, emphasize, disabled, className, onClick, children, size, ...props },
  ref,
) {
  return (
    <button
      className={`
        group border border-neutral-200
        bg-white leading-none text-neutral-700
        transition-all duration-75 enabled:hover:border-emerald-500
        enabled:hover:bg-emerald-500 enabled:hover:text-white disabled:border-neutral-300
        disabled:text-neutral-300 data-[solid]:border-emerald-600
        data-[brand]:bg-[#4640EB] data-[solid]:bg-emerald-600 data-[brand]:text-white data-[solid]:text-neutral-50 data-[brand]:hover:bg-[#2F2BBE] data-[solid]:enabled:hover:border-emerald-600
        data-[solid]:enabled:hover:bg-emerald-600 data-[solid]:enabled:hover:text-neutral-50 data-[solid]:disabled:border-neutral-400
        data-[solid]:disabled:bg-neutral-400 [&_i]:text-neutral-400 [&_i]:hover:text-white
        ${className}
        ${size === "small" ? "rounded px-3 py-2" : "rounded-md px-3 py-2"}
        ${emphasize ? "relative inline-flex items-center justify-center overflow-hidden hover:scale-105" : ""}
      `}
      data-solid={solid ? "" : null}
      data-brand={brand ? "" : null}
      autoFocus={autoFocus}
      disabled={disabled}
      onClick={onClick}
      ref={ref}
      {...props}
    >
      <div className="relative z-10 flex w-full flex-row items-center justify-center gap-2">{children}</div>
      {emphasize && (
        // eslint-disable-next-line tailwindcss/enforces-negative-arbitrary-values
        <div class="absolute inset-0 -top-[20px] flex h-[calc(100%+40px)] w-full animate-[shine-infinite_4s_ease-in-out_infinite] justify-center blur-[12px]">
          <div
            class={`relative h-full w-10 lg:w-12 ${solid ? "bg-emerald-300/50" : "bg-emerald-200/50"}`}
          ></div>
        </div>
      )}
    </button>
  )
}

export default forwardRef(Button)

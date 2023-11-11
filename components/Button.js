export default function Button({ solid, autoFocus, disabled, className, onClick, children }) {
  return (
    <button
      className={`
        rounded-md border
        border-teal-500 bg-teal-50/50
        px-3 py-1
        text-teal-500 shadow-sm
        hover:bg-teal-100/50 hover:text-teal-600
        disabled:border-stone-300 disabled:text-stone-300
        data-[solid]:bg-teal-500 data-[solid]:text-stone-50
        data-[solid]:hover:border-teal-400 data-[solid]:hover:bg-teal-400
        ${className}
      `}
      data-solid={solid ? "" : null}
      autoFocus={autoFocus}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

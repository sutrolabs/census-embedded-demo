export function Card({ className, disabled, children }) {
  return (
    <div
      className={`
        rounded-md border border-teal-500/40  bg-stone-50 px-4 py-3
        shadow-sm data-[disabled]:border-stone-200
        ${className}
      `}
      data-disabled={disabled ? "" : null}
    >
      {children}
    </div>
  )
}

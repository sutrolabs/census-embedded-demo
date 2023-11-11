export function Card({ className, disabled, children }) {
  return (
    <div
      className={`
        rounded-md border border-teal-500/40  bg-stone-50 p-5
        shadow-sm data-[disabled]:border-stone-200
        ${className}
      `}
      data-disabled={disabled ? "" : null}
    >
      {children}
    </div>
  )
}

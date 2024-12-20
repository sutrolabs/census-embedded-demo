export function Card({ className, disabled, children, variant = "default" }) {
  return (
    <div
      className={`
        rounded-md border border-indigo-500/40  bg-stone-50
        px-3 py-5
        shadow-sm transition
        data-[disabled]:border-stone-200
        ${className}
      `}
      data-disabled={disabled ? "" : null}
    >
      {children}
    </div>
  )
}

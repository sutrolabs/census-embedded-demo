export default function Card({ className, disabled, children, noPadding, shadow = true }) {
  return (
    <div
      className={`
        rounded-md border border-neutral-100  bg-white ${!noPadding ? "px-3 py-5" : ""} ${
          shadow ? "shadow-sm" : ""
        }
       transition
        data-[disabled]:border-neutral-100
        ${className}
      `}
      data-disabled={disabled ? "" : null}
    >
      {children}
    </div>
  )
}

export function Anchor({ className, href, children }) {
  return (
    <a
      className={`
        text-emerald-500
        underline
        transition
        hover:text-emerald-600
        ${className}`}
      href={href}
    >
      {children}
    </a>
  )
}

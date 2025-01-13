export function Anchor({ className, href, children }) {
  return (
    <a
      className={`
        text-orange-700
        underline
        transition
        hover:text-orange-600
        ${className}`}
      href={href}
    >
      {children}
    </a>
  )
}

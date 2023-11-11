export function Anchor({ className, href, children }) {
  return (
    <a
      className={`
        text-teal-600
        underline
        hover:text-teal-500
        ${className}`}
      href={href}
    >
      {children}
    </a>
  )
}

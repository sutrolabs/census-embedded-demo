export function Anchor({ className, href, children }) {
  return (
    <a
      className={`
        text-indigo-700
        underline
        transition
        hover:text-indigo-600
        ${className}`}
      href={href}
    >
      {children}
    </a>
  )
}

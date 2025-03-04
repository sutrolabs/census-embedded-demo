import Image from "next/image"

export function ConnectionLogo({ src, alt = "", className = "" }) {
  if (!src) return null

  return (
    <div className="flex h-8 w-8 place-items-center justify-center rounded border border-neutral-100 bg-white shadow-sm">
      <Image src={src} height="24" width="24" alt={alt} className={`h-4 w-4 ${className}`} />
    </div>
  )
}

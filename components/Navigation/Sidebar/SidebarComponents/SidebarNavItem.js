import { Text } from "@radix-ui/themes"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Item({ name, href, icon: Icon }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`flex cursor-pointer flex-row items-center gap-2 rounded border p-2 text-sm font-medium leading-none  ${
        isActive
          ? " border-neutral-100 bg-white text-neutral-700 shadow"
          : "border-transparent text-neutral-600 hover:bg-neutral-200/50 hover:text-neutral-700"
      }`}
    >
      {Icon && <Icon className={`h-4 ${isActive ? "text-emerald-500" : ""}`} />}
      <Text>{name}</Text>
    </Link>
  )
}

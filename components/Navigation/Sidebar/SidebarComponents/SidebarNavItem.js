import { Text } from "@radix-ui/themes"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@components/HoverCard/BrandedHoverCard/BrandedHoverCard"

export function Item({ name, href, icon: Icon, preview }) {
  const pathname = usePathname()
  const isActive = pathname === href

  const navItem = (
    <Link
      href={href}
      className={`group flex cursor-pointer flex-row items-center gap-2 rounded p-2  text-sm font-medium leading-none no-underline transition-all duration-75  ${
        isActive
          ? "  bg-neutral-200 text-neutral-700 hover:bg-neutral-200/50 hover:text-neutral-700"
          : "border-transparent text-neutral-500 hover:bg-neutral-200/50 hover:text-neutral-700"
      }`}
    >
      {Icon && (
        <Icon
          className={`h-4 w-4 transition-all duration-75 ${
            isActive ? "text-neutral-600" : "text-neutral-400 group-hover:text-neutral-500"
          }`}
        />
      )}
      <Text>{name}</Text>
    </Link>
  )

  if (preview) {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>{navItem}</HoverCardTrigger>
        <HoverCardContent side="right">
          <span className="text-sm">{preview}</span>
          <div className="bg-brand-development absolute inset-x-0 bottom-0 -z-0 h-3/4 w-full" />
        </HoverCardContent>
      </HoverCard>
    )
  }

  return navItem
}

import Link from "next/link"
import { useRouter } from "next/router"

import { Tag } from "@components/Tag"

export default function Sidebar() {
  return (
    <div className="invisible flex flex-col justify-between gap-4 border-r border-stone-300 bg-stone-50 sm:visible">
      <nav className="flex flex-col gap-4 px-6 py-8">
        <Item name="Dashboard" href="/" />
        <Item name="Retailers" href="/retailers" />
        <Item name="Trends" href="/trends" />
        <Item name="Integrations" href="/integrations" />
        <Item nested name="CRM" href="/integrations/crm" />
        <Item nested name="Ad Platforms" href="/integrations/ads" />
        <Item name="Alerts" href="/alerts" />
        <Item name="Settings" href="/settings" />
      </nav>
      <div className="flex flex-col items-center gap-2 border-t  border-stone-300 p-4">
        <div className="text-sm font-medium">Sync Status</div>
        <Tag className="bg-emerald-200 text-xs font-medium text-emerald-700" text="Up to date" />
      </div>
    </div>
  )
}

function Item({ name, nested, href }) {
  const router = useRouter()
  const selected = router.asPath === href

  return (
    <Link href={href}>
      <a
        className="
        cursor-pointer border-stone-900 pl-2 font-medium text-stone-900
        hover:border-teal-800 hover:text-teal-800
        data-[nested]:ml-4
        data-[selected]:border-l-2 data-[selected]:font-bold
      "
        data-selected={selected ? "" : null}
        data-nested={nested ? "" : null}
      >
        {name}
      </a>
    </Link>
  )
}

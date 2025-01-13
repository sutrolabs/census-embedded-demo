import Link from "next/link"
import { useRouter } from "next/router"
import { Tooltip } from "react-tooltip"

import Toggle from "@components/Toggle"
import { Text } from "@radix-ui/themes"
import { usePathname } from "next/navigation"
import { BoltIcon, HomeIcon, SquaresPlusIcon, TableCellsIcon } from "@heroicons/react/20/solid"

const navItems = [
  {
    id: 1,
    href: "/",
    name: "Dashboard",
    icon: HomeIcon,
  },
  {
    id: 2,
    href: "/integrations/import-dataset",
    name: "Datasets",
    icon: TableCellsIcon,
  },
  {
    id: 3,
    href: "/integrations",
    name: "Integrations",
    icon: SquaresPlusIcon,
  },
  {
    id: 4,
    href: "/integrations/export-crm",
    name: "CRM",
    group: "integrations",
  },
  {
    id: 5,
    href: "/integrations/export-ads",
    name: "Ad Platforms",
    group: "integrations",
  },
]

const groupedNavItems = navItems.reduce((acc, item) => {
  if (item.group) {
    if (!acc[item.group]) {
      acc[item.group] = []
    }
    acc[item.group].push(item)
  } else {
    acc.root = acc.root || []
    acc.root.push(item)
  }
  return acc
}, {})

export default function Sidebar({ onLogOut, embedMode, setEmbedMode, devMode, setDevMode }) {
  return (
    <div className="flex shrink-0 flex-row items-end justify-between gap-4 border-r border-slate-200 bg-slate-50 p-2 md:h-screen md:w-[240px] md:flex-col md:items-center md:justify-start md:p-6">
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-row items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white p-3 shadow">
            <i className="fa-solid fa-magnet text-sm leading-none" />
          </div>
          <Text className="text-sm font-medium leading-none">Marketing Magnet</Text>
        </div>
        {/* Mobile Navbar */}
        <nav className="flex flex-row items-end gap-1 md:hidden">
          {navItems.map((item) => (
            <Item key={item.id} name={item.name} href={item.href} />
          ))}
        </nav>
      </div>
      {/* Desktop Navbar */}
      <nav className="hidden w-full flex-col gap-1 self-start md:flex">
        {groupedNavItems.root?.map((item) => (
          <Item key={item.id} name={item.name} href={item.href} icon={item.icon} />
        ))}
        {Object.entries(groupedNavItems).map(
          ([group, items]) =>
            group !== "root" && (
              <div key={group} className="ml-4 flex flex-col gap-1 border-l border-slate-200 pl-3">
                {items.map((item) => (
                  <Item key={item.id} name={item.name} href={item.href} icon={item.icon} />
                ))}
              </div>
            ),
        )}
      </nav>

      <SidebarFooter
        onLogOut={onLogOut}
        embedMode={embedMode}
        setEmbedMode={setEmbedMode}
        devMode={devMode}
        setDevMode={setDevMode}
      />
    </div>
  )
}

function Item({ name, nested, href, icon: Icon }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`flex cursor-pointer flex-row items-center gap-2 rounded px-2 py-2 text-sm font-medium leading-none   ${
        isActive
          ? "bg-slate-200 text-slate-900 "
          : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-700"
      }`}
    >
      {Icon && <Icon className={`h-4 ${isActive ? "text-slate-900" : ""}`} />}
      <Text>{name}</Text>
    </Link>
  )
}

const SidebarFooter = ({ onLogOut, embedMode, setEmbedMode, devMode, setDevMode }) => (
  <div className="flex flex-col items-center justify-between md:mt-auto md:w-full">
    <div className="mb-3 hidden md:flex md:w-full md:flex-col md:gap-3">
      <div className="flex items-center">
        <span className="px-2">Embed</span>
        <a id="embed-mode">
          <Toggle checked={embedMode} onChange={() => setEmbedMode((prevCheck) => !prevCheck)} />
        </a>
        <Tooltip anchorSelect="#embed-mode">
          Show Census UI flows embedded directly in the application, or redirect to the flows.
        </Tooltip>
      </div>
      <div className="flex items-center">
        <span className="px-2">Dev Mode</span>
        <a id="dev-mode">
          <Toggle checked={devMode} onChange={() => setDevMode((prevCheck) => !prevCheck)} />
        </a>
        <Tooltip anchorSelect="#dev-mode">
          Show tooltips of the Census API requests being made when interacting with the UX.
        </Tooltip>
      </div>
    </div>
    <div className="flex items-center justify-between md:mt-auto md:w-full">
      <button onClick={onLogOut} className="flex items-center gap-2 text-sm md:gap-3 md:text-2xl">
        <i className="fa-solid fa-right-from-bracket mb-2 ml-2 md:mb-1" />
        <p className="hidden md:block">Log out</p>
      </button>
      <div className="hidden items-center gap-4 text-2xl md:flex">
        <Link
          className="flex items-center gap-2 text-sm md:gap-3 md:text-2xl"
          href="https://developers.getcensus.com/getting-started/introduction"
        >
          <i className="fa-solid fa-book" />
        </Link>
        <Link
          className="flex items-center gap-2 text-sm md:gap-3 md:text-2xl"
          href="https://github.com/sutrolabs/census-embedded-demo"
        >
          <i className="fa-brands fa-github" />
        </Link>
      </div>
    </div>
  </div>
)

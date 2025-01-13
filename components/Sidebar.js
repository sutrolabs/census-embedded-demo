import Link from "next/link"
import { useRouter } from "next/router"
import { Tooltip } from "react-tooltip"

import Toggle from "@components/Toggle"
import { Text } from "@radix-ui/themes"
import { usePathname } from "next/navigation"

const navItems = [
  {
    id: 1,
    href: "/",
    name: "Dashboard",
  },
  {
    id: 2,
    href: "/integrations",
    name: "Integrations",
  },
  {
    id: 3,
    href: "/integrations/export-crm",
    name: "CRM",
  },
  {
    id: 4,
    href: "/integrations/export-ads",
    name: "Ad Platforms",
  },
  {
    id: 5,
    href: "/integrations/import-dataset",
    name: "Import Dataset",
  },
]

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
        {navItems.map((item) => (
          <Item key={item.id} name={item.name} href={item.href} />
        ))}
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

function Item({ name, nested, href }) {
  const router = useRouter()
  const selected = router.asPath === href
  const pathname = usePathname()

  return (
    <Link
      href={href}
      className={`cursor-pointer rounded p-2 text-sm font-medium leading-none text-slate-900 hover:border-teal-800 hover:text-teal-500 ${
        pathname === href ? "hover: bg-slate-200" : ""
      }`}
      data-nested={nested ? "" : null}
    >
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

import Link from "next/link"
import { useRouter } from "next/router"
import { Tooltip } from "react-tooltip"

import Toggle from "@components/Toggle"
import { Text } from "@radix-ui/themes"

export default function Sidebar({ onLogOut, embedMode, setEmbedMode, devMode, setDevMode }) {
  return (
    <div className="flex shrink-0 flex-row items-end justify-between gap-4 border-r border-slate-200 bg-slate-50 p-2 md:h-screen md:w-[240px] md:flex-col md:items-center md:justify-start md:p-6">
      <div className="flex flex-col gap-4 overflow-x-auto">
        <Link href="/" className="flex flex-row items-center gap-2">
          <i className="fa-solid fa-magnet" />
          <Text>Marketing Magnet</Text>
        </Link>
        {/* Mobile Navbar */}
        <nav className="flex flex-row items-end gap-2 md:hidden">
          <Item name="Dashboard" href="/" />
          <Item name="Integrations" href="/integrations" />
          <Item name="CRM" href="/integrations/export-crm" />
          <Item name="Ad Platforms" href="/integrations/export-ads" />
          <Item name="Import Dataset" href="/integrations/import-dataset" />
        </nav>
      </div>
      {/* Desktop Navbar */}
      <nav className="hidden flex-col gap-4 self-start md:flex">
        <Item name="Dashboard" href="/" />
        <Item name="Integrations" href="/integrations" />
        <Item name="Export to CRM" href="/integrations/export-crm" />
        <Item name="Export to Ad Platforms" href="/integrations/export-ads" />
        <Item name="Import Dataset to Marketing Magnet" href="/integrations/import-dataset" />
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

  return (
    <Link
      href={href}
      className="cursor-pointer text-sm font-medium text-slate-900 hover:border-teal-800 hover:text-teal-800
    data-[nested]:ml-4"
      data-selected={selected ? "" : null}
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

import Link from "next/link"
import { useRouter } from "next/router"

export default function Sidebar({ onLogOut }) {
  return (
    <>
      <div className="hidden md:block md:h-screen md:w-2/5 xl:w-1/4" />
      <div className="flex flex-row items-end justify-between gap-4 border-emerald-600 bg-emerald-400 p-2 md:fixed md:h-screen md:w-2/5 md:flex-col md:items-center md:justify-start md:p-6 xl:w-1/4">
        <div className="flex flex-col gap-4 overflow-x-auto">
          <Link href="/">
            <a className="flex flex-row items-center gap-4 md:flex-col md:p-6">
              <i className="fa-solid fa-magnet text-2xl md:text-6xl" />
              <div className="flex flex-col">
                <h1 className="text-center text-lg font-bold md:text-6xl">Marketing Magnet</h1>
              </div>
            </a>
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
        <div className="hidden text-center text-lg italic text-stone-700 md:block md:text-2xl">
          Superpowering marketing operations since{" "}
          <abbr title="Did you know, marketing was first invented when someone figured out they could sell more woolly mammoth meat with a catchy slogan?">
            2024
          </abbr>
        </div>
        {/* Desktop Navbar */}
        <nav className="hidden flex-col gap-4 self-start px-6 py-8 md:flex">
          <Item name="Dashboard" href="/" />
          <Item name="Integrations" href="/integrations" />
          <Item nested name="Export to CRM" href="/integrations/export-crm" />
          <Item nested name="Export to Ad Platforms" href="/integrations/export-ads" />
          <Item nested name="Import Dataset to Marketing Magnet" href="/integrations/import-dataset" />
        </nav>

        <SidebarFooter onLogOut={onLogOut} />
      </div>
    </>
  )
}

function Item({ name, nested, href }) {
  const router = useRouter()
  const selected = router.asPath === href

  return (
    <Link href={href}>
      <a
        className="cursor-pointer border-b-2 border-transparent text-sm font-medium text-stone-900 hover:border-teal-800 hover:text-teal-800
        data-[nested]:ml-4 data-[selected]:border-stone-900 data-[selected]:font-bold md:border-b-0 md:border-l-2 md:pl-2 md:text-2xl"
        data-selected={selected ? "" : null}
        data-nested={nested ? "" : null}
      >
        {name}
      </a>
    </Link>
  )
}

const SidebarFooter = ({ onLogOut }) => (
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
        <a target="_blank">
          <i className="fa-solid fa-book" />
        </a>
      </Link>
      <Link
        className="flex items-center gap-2 text-sm md:gap-3 md:text-2xl"
        href="https://github.com/sutrolabs/census-embedded-demo"
      >
        <a target="_blank">
          <i className="fa-brands fa-github" />
        </a>
      </Link>
    </div>
  </div>
)

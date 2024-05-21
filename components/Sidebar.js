import Link from "next/link"
import { useRouter } from "next/router"

export default function Sidebar({ onLogOut }) {
  return (
    <>
      <div className="hidden md:block md:h-screen md:w-2/5 xl:w-1/4" />
      <div className="flex flex-row items-end justify-between gap-4 border-emerald-600 bg-emerald-400 p-2 md:fixed md:h-screen md:w-2/5 md:flex-col md:items-center md:justify-start md:p-6 xl:w-1/4">
        <div className="flex flex-col gap-4">
          <Link href="/">
            <a className="flex flex-row items-center gap-4 md:flex-col md:p-6">
              <i className="fa-solid fa-magnet text-2xl sm:text-6xl" />
              <div className="flex flex-col">
                <h1 className="text-center text-lg font-bold md:text-6xl">Marketing Magnet</h1>
              </div>
            </a>
          </Link>
          <nav className="flex flex-row items-end gap-2 md:hidden">
            <Item name="CRM" href="/export-crm" />
            <Item name="Ad Platforms" href="/export-ads" />
            <Item name="Import Dataset" href="/import-dataset" />
          </nav>
        </div>
        <div className="hidden text-center text-lg italic text-stone-700 sm:block md:text-2xl">
          Superpowering marketing operations since{" "}
          <abbr title="Did you know, marketing was first invented when someone figured out they could sell more woolly mammoth meat with a catchy slogan?">
            2024
          </abbr>
        </div>
        <nav className="hidden flex-col gap-4 self-start px-6 py-8 md:flex">
          <Item name="Export to CRM" href="/export-crm" />
          <Item name="Export to Ad Platforms" href="/export-ads" />
          <Item name="Import Dataset to Marketing Magnet" href="/import-dataset" />
        </nav>

        <button
          onClick={onLogOut}
          className="flex items-center gap-2 text-sm md:mt-auto md:gap-4 md:self-start md:text-2xl"
        >
          <i className="fa-solid fa-right-from-bracket ml-2" />
          <p className="hidden md:block">Log out</p>
        </button>
      </div>
    </>
  )
}

function Item({ name, href }) {
  const router = useRouter()
  const selected = router.asPath === href

  return (
    <Link href={href}>
      <a
        className="
        cursor-pointer border-b-2 border-transparent text-sm font-medium
        text-stone-900 hover:border-teal-800 hover:text-teal-800
        data-[selected]:border-stone-900 data-[selected]:font-bold md:border-b-0
        md:border-l-2 md:pl-2 md:text-2xl
      "
        data-selected={selected ? "" : null}
      >
        {name}
      </a>
    </Link>
  )
}

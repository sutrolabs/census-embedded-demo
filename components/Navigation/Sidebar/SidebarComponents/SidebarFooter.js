import { Tooltip } from "react-tooltip"
import Link from "next/link"
import Toggle from "@components/Toggle"

export const SidebarFooter = ({ onLogOut, embedMode, setEmbedMode, devMode, setDevMode }) => (
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

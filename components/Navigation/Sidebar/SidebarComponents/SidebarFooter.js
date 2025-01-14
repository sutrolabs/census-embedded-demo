import { Text } from "@radix-ui/themes"
import Link from "next/link"
import { Tooltip } from "react-tooltip"

import { CentralLogOutIcon } from "@components/Icons/LogOut"
import Toggle from "@components/Toggle"

const footerLinks = [
  {
    id: 1,
    label: "Documentation",
    href: "https://developers.getcensus.com/getting-started/introduction",
    icon: "fa-brands fa-github",
  },
  {
    id: 2,
    label: "GitHub",
    href: "https://github.com/sutrolabs/census-embedded-demo",
    icon: "fa-solid fa-book",
  },
]

export const SidebarFooter = ({ onLogOut, embedMode, setEmbedMode, devMode, setDevMode }) => {
  const modeToggles = [
    {
      id: "embed-mode",
      label: "Embedded Components",
      checked: embedMode,
      onChange: () => setEmbedMode((prevCheck) => !prevCheck),
      anchorSelect: "#embed-mode",
      tooltip: "Show Census UI flows embedded directly in the application, or redirect to the flows.",
    },
    {
      id: "dev-mode",
      label: "Developer Mode",
      checked: devMode,
      onChange: () => setDevMode((prevCheck) => !prevCheck),
      anchorSelect: "#dev-mode",
      tooltip: "Show tooltips of the Census API requests being made when interacting with the UX.",
    },
  ]
  return (
    <div className="flex flex-col justify-between md:w-full">
      <div className="mb-3 hidden md:flex md:w-full md:flex-col md:gap-3">
        {modeToggles.map((mode) => (
          <div className="flex flex-row items-center justify-between" key={mode.id} id={mode.id}>
            <Text className="text-sm font-medium">{mode.label}</Text>
            <a>
              <Toggle checked={mode.checked} onChange={mode.onChange} />
            </a>
            <Tooltip anchorSelect={mode.anchorSelect}>{mode.tooltip}</Tooltip>
          </div>
        ))}
        <div className="hidden items-center gap-4 text-2xl md:flex md:flex-col">
          {footerLinks.map((link) => (
            <Link key={link.id} className="flex items-center gap-2 text-sm" href={link.href}>
              <Text>{link.label}</Text>
              <i className={link.icon} />
            </Link>
          ))}
        </div>
      </div>

      <button
        onClick={onLogOut}
        className="flex flex-row items-center justify-center gap-2 rounded-md border border-neutral-200 px-3 py-2 text-sm"
      >
        <CentralLogOutIcon className="h-4 w-4 text-neutral-500" />
        <Text className="hidden text-neutral-600 md:block">Log out</Text>
      </button>
    </div>
  )
}

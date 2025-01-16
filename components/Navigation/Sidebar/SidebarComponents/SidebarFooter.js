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
    icon: "fa-solid fa-book ",
  },
  {
    id: 2,
    label: "GitHub",
    href: "https://github.com/sutrolabs/census-embedded-demo",
    icon: "fa-brands fa-github",
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
      <div className="items-center gap-4">
        {footerLinks.map((link) => (
          <Link
            key={link.id}
            className="flex flex-row items-center gap-2 p-1 text-sm text-neutral-500 no-underline"
            href={link.href}
            target="_blank"
          >
            <i className={link.icon} />
            <Text>{link.label}</Text>
          </Link>
        ))}
      </div>
      <div className="my-4 h-px w-full bg-neutral-200" />
      <div className="mb-3 hidden px-2 md:flex md:w-full md:flex-col md:gap-3">
        {modeToggles.map((mode) => (
          <div className="flex flex-row items-center justify-between" key={mode.id} id={mode.id}>
            <Text className="text-sm font-medium">{mode.label}</Text>
            <a>
              <Toggle checked={mode.checked} onChange={mode.onChange} />
            </a>
            <Tooltip anchorSelect={mode.anchorSelect}>{mode.tooltip}</Tooltip>
          </div>
        ))}
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

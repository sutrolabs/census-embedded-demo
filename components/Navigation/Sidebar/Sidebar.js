import { Text } from "@radix-ui/themes"

import { CentralHomeIcon } from "@components/Icons/Home"
import { CentralTableIcon } from "@components/Icons/Table"
import { CentralSquareGridCircleIcon } from "@components/Icons/SquareGridCircle"
import { SidebarFooter } from "@components/Navigation/Sidebar/SidebarComponents/SidebarFooter"
import { Item } from "@components/Navigation/Sidebar/SidebarComponents/SidebarNavItem"
import Image from "next/image"

const navItems = [
  {
    id: 1,
    href: "/",
    name: "Dashboard",
    icon: CentralHomeIcon,
  },
  {
    id: 2,
    href: "/integrations/import-dataset",
    name: "Datasets",
    icon: CentralTableIcon,
  },
  {
    id: 3,
    href: "/integrations",
    name: "Integrations",
    icon: CentralSquareGridCircleIcon,
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
    <div className="flex shrink-0 flex-row items-end justify-between gap-4 border-r border-neutral-200 bg-neutral-50 px-2.5 py-4 md:h-screen md:w-[240px] md:flex-col md:items-center md:justify-between">
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-row items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-md border border-neutral-100">
            <Image src="acme-demo-logo-square.jpg" className="object-cover" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <Text className=" font-medium">Acme</Text>
            <Text className="text-xxs text-neutral-500">Powering marketing operations</Text>
          </div>
        </div>
        {/* Mobile Navbar */}
        <nav className="flex flex-row items-end gap-1 md:hidden">
          {navItems.map((item) => (
            <Item key={item.id} name={item.name} href={item.href} />
          ))}
        </nav>
        {/* Desktop Navbar */}
        <nav className="hidden w-full flex-col gap-0.5 self-start md:flex">
          {groupedNavItems.root?.map((item) => (
            <Item key={item.id} name={item.name} href={item.href} icon={item.icon} />
          ))}
          {Object.entries(groupedNavItems).map(
            ([group, items]) =>
              group !== "root" && (
                <div key={group} className="ml-4 flex flex-col gap-0.5 border-l border-neutral-200 pl-3">
                  {items.map((item) => (
                    <Item key={item.id} name={item.name} href={item.href} icon={item.icon} />
                  ))}
                </div>
              ),
          )}
        </nav>
      </div>

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

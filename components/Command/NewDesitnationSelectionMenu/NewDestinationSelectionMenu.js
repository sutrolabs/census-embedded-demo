"use client"

import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import Button from "@components/Button/Button/Button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@components/Command/command"
import { EXCLUDED_DESTINATION_CONNECTIONS } from "@hooks/helpers/useExclusions"
import { getLogoForDestinationType, getCategoryForDestinationType } from "@hooks/useDestinationLogos"
import { useCensusEmbedded } from "@providers/CensusEmbeddedProvider"
import { createDevModeAttr } from "@utils/devMode"

export function NewDestinationSelectionMenu({
  trigger,
  destinationTypes,
  workspaceAccessToken,
  destinations,
}) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { devMode } = useCensusEmbedded()

  const filteredDestinationTypes = destinationTypes.filter(
    (destinationType) =>
      !EXCLUDED_DESTINATION_CONNECTIONS.includes(destinationType.service_name) &&
      destinationType.creatable_via_connect_link === true &&
      getLogoForDestinationType(destinationType) !== null,
  )

  // Group destinations by category
  const groupedDestinations = filteredDestinationTypes.reduce((acc, destination) => {
    const category = getCategoryForDestinationType(destination)
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(destination)
    return acc
  }, {})

  // Sort categories with "Popular" first, then alphabetically
  const sortedCategories = Object.keys(groupedDestinations).sort((a, b) => {
    if (a === "Popular") return -1
    if (b === "Popular") return 1
    return a.localeCompare(b)
  })

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleDestinationSelect = async (destinationType) => {
    try {
      // Close the command menu
      setOpen(false)

      // Create a destination connect link
      const response = await fetch("/api/create_destination_connect_link", {
        method: "POST",
        headers: {
          ["authorization"]: `Bearer ${workspaceAccessToken}`,
          ["content-type"]: "application/json",
        },
        body: JSON.stringify({
          type: destinationType.service_name,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create destination connect link")
      }

      const data = await response.json()

      // Redirect to the Census connect flow using the returned URI
      window.location.href = data.uri
    } catch (error) {}
  }

  return (
    <>
      {/* Trigger button */}
      <Button onClick={() => setOpen(true)}>
        {trigger}
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded bg-zinc-100 px-1.5 font-mono text-[10px] font-medium leading-none opacity-100 group-hover:bg-green-900/50 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command
          className="rounded-lg border shadow-md"
          {...(devMode
            ? createDevModeAttr({
                url: `https://app.getcensus.com/api/v1/connectors`,
                method: "GET",
                headers: `Authorization: Bearer <workspaceAccessToken>`,
                note: "Lists types of destination connections that can be created in the current workspace",
                link: "https://developers.getcensus.com/api-reference/connectors/list-destination-types",
              })
            : {})}
        >
          <CommandInput placeholder="Search destinations..." />
          <CommandList>
            <CommandEmpty>No destinations found.</CommandEmpty>
            {/* Group destinations by category */}
            {sortedCategories.map((category) => (
              <div key={category}>
                <CommandGroup heading={category}>
                  {groupedDestinations[category].map((destinationType) => {
                    const logo = getLogoForDestinationType(destinationType)
                    const isExistingDestination = destinations?.some(
                      (dest) => dest.type === destinationType.service_name,
                    )
                    return (
                      <CommandItem
                        key={destinationType.id}
                        onSelect={() => handleDestinationSelect(destinationType)}
                        className="flex flex-row items-center justify-between gap-4 text-base font-medium"
                      >
                        <div className="flex flex-row items-center gap-4">
                          {logo ? (
                            <Image
                              src={logo}
                              alt={`${destinationType.label} logo`}
                              width={24}
                              height={24}
                              className="h-6 w-6 object-contain"
                            />
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded bg-neutral-100">
                              <i className="fa-regular fa-plug text-neutral-500" />
                            </div>
                          )}
                          {destinationType.label}
                        </div>
                        {isExistingDestination && (
                          <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
                            <i className="fa-solid fa-plug" />
                          </div>
                        )}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
                <CommandSeparator />
              </div>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}

import { useContext } from "react"

import { IntegrationsContext } from "contexts/IntegrationsContext"

export const useHideSourceDestination = () => {
  const { sourceHidden, destinationHidden } = useContext(IntegrationsContext)

  const formatLinkToHideSourceDestination = (link) => {
    if (!link) return link

    let formattedLink = link
    if (sourceHidden) formattedLink += "&source_hidden=true"
    else if (destinationHidden) formattedLink += "&destination_hidden=true"

    return formattedLink
  }

  return formatLinkToHideSourceDestination
}

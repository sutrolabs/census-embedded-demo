import { useContext } from "react"

import { IntegrationsContext } from "contexts/IntegrationsContext"

export const useHideSourceDestination = () => {
  const { sourceHidden, destinationHidden, destination, source } = useContext(IntegrationsContext)

  const formatLinkToHideSourceDestination = (link, edit = false) => {
    if (!link) return link

    let formattedLink = link

    // If the source or destination is hidden, it must be preset
    if (source?.connection_id && source?.model_id) {
      if (!edit) {
        formattedLink =
          formattedLink + "&source_connection_id=" + source.connection_id + "&model_id=" + source.model_id
      }

      if (sourceHidden) formattedLink += "&source_hidden=true"
    }
    if (destination?.connection_id && destination?.object_name) {
      formattedLink =
        formattedLink +
        "&destination_connection_id=" +
        destination.connection_id +
        "&destination_object_name=" +
        destination.object_name

      if (destinationHidden) formattedLink += "&destination_hidden=true"
    }

    return formattedLink
  }

  return formatLinkToHideSourceDestination
}

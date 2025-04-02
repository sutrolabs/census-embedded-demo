const { destination_connection_logos } = require("@data/connections/destination-connection-logos")

export const getLogoForDestinationType = (destinationType) => {
  const logoEntry = destination_connection_logos.find(
    (logo) => logo.label.toLowerCase() === destinationType.service_name.toLowerCase(),
  )
  return logoEntry ? logoEntry.logo : null
}

export const getCategoryForDestinationType = (destinationType) => {
  const logoEntry = destination_connection_logos.find(
    (logo) => logo.label.toLowerCase() === destinationType.service_name.toLowerCase(),
  )
  return logoEntry ? logoEntry.category : "Other"
}

export const getLogoForDestination = (destination) => {
  const logoEntry = destination_connection_logos.find((logo) => logo.label.toLowerCase() === destination.type)
  return logoEntry ? logoEntry.logo : null
}

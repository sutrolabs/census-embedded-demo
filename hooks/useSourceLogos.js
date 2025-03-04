const { source_connection_logos } = require("@data/connections/source-connection-logos")

export const getLogoForSourceType = (sourceType) => {
  const logoEntry = source_connection_logos.find(
    (logo) => logo.label.toLowerCase() === sourceType.service_name.toLowerCase(),
  )
  return logoEntry ? logoEntry.logo : null
}

export const getLogoForSource = (source) => {
  const logoEntry = source_connection_logos.find((logo) => logo.label.toLowerCase() === source.type)
  return logoEntry ? logoEntry.logo : null
}

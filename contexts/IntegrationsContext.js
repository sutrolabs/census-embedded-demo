import React, { createContext, useState } from "react"

export const IntegrationsContext = createContext()

export const IntegrationsProvider = ({ children }) => {
  const [sourceHidden, setSourceHidden] = useState(false)
  const [destinationHidden, setDestinationHidden] = useState(false)
  const [destination, setDestination] = useState(null)
  const [source, setSource] = useState(null)

  return (
    <IntegrationsContext.Provider
      value={{
        sourceHidden,
        setSourceHidden,
        destinationHidden,
        setDestinationHidden,
        destination,
        setDestination,
        source,
        setSource,
      }}
    >
      {children}
    </IntegrationsContext.Provider>
  )
}

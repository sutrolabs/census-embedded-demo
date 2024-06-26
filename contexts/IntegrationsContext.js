import React, { createContext, useState } from "react"

export const IntegrationsContext = createContext()

export const IntegrationsProvider = ({ children }) => {
  const [sourceHidden, setSourceHidden] = useState(false)
  const [destinationHidden, setDestinationHidden] = useState(false)

  return (
    <IntegrationsContext.Provider
      value={{ sourceHidden, setSourceHidden, destinationHidden, setDestinationHidden }}
    >
      {children}
    </IntegrationsContext.Provider>
  )
}

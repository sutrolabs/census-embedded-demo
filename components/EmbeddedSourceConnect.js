import { useState, useEffect } from "react"

import { censusFrontendBaseUrl } from "@utils/url"

export default function EmbeddedSourceConnect({ connectLink, exitedConnectionFlow }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin != censusFrontendBaseUrl) {
        return
      }

      if (event.data.message === "LOADED") setLoaded(true)

      if (event.data.message === "EXITED_CONNECT_FLOW") exitedConnectionFlow(event.data.data)
    }

    window.addEventListener("message", handleMessage, false)

    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [exitedConnectionFlow])

  const iframeClass = loaded ? "" : "hidden"

  return (
    <>
      <iframe className={iframeClass} width="100%" height="800px" src={connectLink} />
    </>
  )
}

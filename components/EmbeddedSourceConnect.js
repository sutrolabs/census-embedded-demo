import { useEffect } from "react"

import { censusFrontendBaseUrl } from "@utils/url"

export default function EmbeddedSourceConnect({ connectLink, exitedConnectionFlow }) {
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin != censusFrontendBaseUrl) {
        return
      }
      if (event.data.message === "EXITED_CONNECT_FLOW") exitedConnectionFlow(event.data.data)
    }

    window.addEventListener("message", handleMessage, false)

    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [exitedConnectionFlow])

  return (
    <>
      <iframe width="100%" height="800px" src={connectLink} />
    </>
  )
}

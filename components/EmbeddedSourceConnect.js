import { useEffect } from "react"

import { censusBaseUrl } from "@utils/url"

export default function EmbeddedSourceConnect({ connectLink, exitedConnectionFlow }) {
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin != censusBaseUrl) {
        return
      }
      if (event.data.message === "EXITED_CONNECT_FLOW") exitedConnectionFlow()
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

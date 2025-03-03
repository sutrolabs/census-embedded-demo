import { useState, useEffect } from "react"

import { censusFrontendBaseUrl } from "@utils/url"

export default function EmbeddedFrame({ connectLink, onExit }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin != censusFrontendBaseUrl) {
        return
      }

      if (event.data.message === "LOADED") {
        setLoaded(true)
      } else if (
        event.data.message === "EXITED_CONNECT_FLOW" ||
        event.data.message === "EXITED_SYNC_FLOW" ||
        event.data.message === "EXITED_SEGMENT_FLOW"
      ) {
        onExit(event.data.data)
      }
    }

    window.addEventListener("message", handleMessage, false)

    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [onExit])

  const iframeClass = loaded ? "" : "hidden"

  return (
    <>
      <iframe
        className={iframeClass}
        width="100%"
        height="800px"
        src={connectLink}
        allow="clipboard-read; clipboard-write"
      />
    </>
  )
}

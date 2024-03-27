import { useEffect } from "react"

export default function EmbeddedSourceConnect({ connectLink, exitedConnectionFlow }) {
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin != "http://localhost:8080") {
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

import { useEffect } from "react"

export default function EmbeddedSourceConnect({ connectLink, completedConnectionFlow }) {
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin != "http://localhost:8080") {
        return
      }
      if (event.data === "EXITED_CONNECT_FLOW") completedConnectionFlow()
    }

    window.addEventListener("message", handleMessage, false)

    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [completedConnectionFlow])

  return (
    <>
      <iframe width="100%" height="800px" src={connectLink} />
    </>
  )
}

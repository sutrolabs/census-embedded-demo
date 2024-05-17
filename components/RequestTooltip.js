import { useEffect, useRef } from "react"
import { Tooltip } from "react-tooltip"

export default function RequestTooltip({ anchorSelect, url, method, headers, body, devMode }) {
  const tooltipRef = useRef(null)

  // Append the tooltip to the body so that it can be displayed on top of other elements like modals
  useEffect(() => {
    const tooltipNode = tooltipRef.current
    if (tooltipNode) {
      document.body.appendChild(tooltipNode)
    }
    return () => {
      // Ensure the node is still part of the document body before removing
      if (tooltipNode && document.body.contains(tooltipNode)) {
        document.body.removeChild(tooltipNode)
      }
    }
  }, [])

  return (
    <div ref={tooltipRef} className={devMode ? "" : "hidden"}>
      <Tooltip anchorSelect={anchorSelect} className="z-50">
        {url && (
          <p>
            <b>Request URL: </b> {url}
          </p>
        )}
        {method && (
          <p>
            <b>Request Method: </b> {method}
          </p>
        )}
        {headers && (
          <p>
            <b>Request Headers: </b> {headers}
          </p>
        )}
        {body && (
          <p>
            <b>Request Body: </b> {body}
          </p>
        )}
      </Tooltip>
    </div>
  )
}

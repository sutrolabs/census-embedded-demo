import { Tooltip } from "react-tooltip"

export default function RequestTooltip({ anchorSelect, url, method, headers, body, devMode }) {
  return (
    <Tooltip anchorSelect={anchorSelect} className={devMode ? "" : "hidden"}>
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
  )
}

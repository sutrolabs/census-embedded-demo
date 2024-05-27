import { Tooltip } from "react-tooltip"

export default function RequestTooltip({ anchorSelect, url, method, headers, body, note, link, devMode }) {
  return (
    <Tooltip anchorSelect={anchorSelect} className={devMode ? "z-10" : "z-10 hidden"} clickable={!!link}>
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
      {(note || link) && <br />}
      {note && <p className="italic">{note}</p>}
      {link && (
        <p>
          <b>Documentation: </b>
          <a href={link} target="_blank" rel="noreferrer" className="italic underline">
            {link}
          </a>
        </p>
      )}
    </Tooltip>
  )
}

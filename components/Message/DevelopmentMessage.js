import { Tooltip } from "react-tooltip"

export default function DevelopmentMessage({ message, tooltipId, tooltipContent }) {
  return (
    <div className="relative flex items-center gap-2 rounded-md border border-neutral-100 bg-white text-xs shadow-md">
      <div className="z-20 flex flex-col px-3 py-2">
        <span className="font-medium text-[#F36812]">Dev Note</span>
        <span className="text-neutral-700">{message}</span>
        {tooltipContent && (
          <>
            <span className="cursor-help text-neutral-400 hover:text-neutral-600" data-tooltip-id={tooltipId}>
              ⓘ
            </span>
            <Tooltip id={tooltipId}>{tooltipContent}</Tooltip>
          </>
        )}
      </div>
      <div className="bg-development-warning absolute inset-0 -z-0 h-full w-full [mask-image:linear-gradient(transparent_0%,black)]" />
    </div>
  )
}

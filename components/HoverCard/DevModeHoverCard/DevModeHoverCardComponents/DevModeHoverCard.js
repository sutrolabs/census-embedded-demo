import { motion } from "motion/react"
import Link from "next/link"
import { forwardRef } from "react"

const DevModeHoverCard = forwardRef(({ style, onMouseEnter, onMouseLeave, hoverData, ...props }, ref) => {
  const infoItems = [
    { key: "headers", label: "Headers", value: hoverData.headers },
    { key: "body", label: "Body", value: hoverData.body },
  ].filter((item) => item.value)

  return (
    <motion.div
      ref={ref}
      className="fixed z-[9999] flex w-[450px] flex-col gap-2 overflow-hidden rounded-md border border-[#4640EB]/10 bg-white p-4 font-mono text-sm shadow-md shadow-[#4640EB]/10"
      style={{
        ...style,
        pointerEvents: "auto",
      }}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.1 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...props}
    >
      <div className="relative z-10 flex flex-col gap-2">
        <div className="flex flex-col gap-2 leading-none">{hoverData.note && <p>{hoverData.note}</p>}</div>
        <div className="my-2 flex h-px w-full flex-col bg-neutral-100" />
        {infoItems.map((item) => (
          <div key={item.key} className={`flex w-full flex-col gap-3 text-xs`}>
            <span className="shrink-0 items-center font-bold uppercase text-neutral-500">{item.label}</span>
            {item.copiable && (
              <button
                onClick={() => copyToClipboard(item.value)}
                className="shrink-0 p-1.5 hover:bg-neutral-100"
              >
                <i className="fa-solid fa-clone leading-none text-neutral-500 " />
              </button>
            )}
            <pre
              className={`max-h-[300px] overflow-y-auto rounded bg-neutral-50 p-2 leading-normal text-neutral-600`}
            >
              <code className=" font-mono text-sm">
                {typeof item.value === "string" ? item.value : JSON.stringify(item.value, null, 2)}
              </code>
            </pre>
          </div>
        ))}

        {hoverData.link && (
          <Link
            href={hoverData.link}
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer text-plum-500"
          >
            <button className=" w-full rounded border border-neutral-100 bg-white p-2 shadow">
              <span className="font-bold">Documentation</span>
            </button>
          </Link>
        )}
      </div>
      <div className="bg-brand-development absolute inset-x-0 bottom-0 -z-0 h-1/2 w-full" />
    </motion.div>
  )
})

DevModeHoverCard.displayName = "DevModeHoverCard"

export default DevModeHoverCard

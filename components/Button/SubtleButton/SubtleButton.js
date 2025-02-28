import { forwardRef } from "react"
export function SubtleButton({ onClick, icon, active, syncs, ref }) {
  return (
    <button
      className={`group flex flex-row items-center gap-2 rounded-md px-1.5 py-1 text-sm leading-none transition duration-200 hover:bg-violet-100 ${
        active ? "bg-violet-50" : ""
      }`}
      onClick={onClick}
      ref={ref}
    >
      <div
        className={`flex h-5 w-5 items-center justify-center rounded border border-violet-300 bg-violet-50 transition duration-100 ${
          active ? "border-violet-50 bg-violet-500" : ""
        }`}
      >
        {icon}
      </div>
      <div
        className={`flex flex-row items-center gap-1 group-hover:text-violet-700 ${
          active ? "text-violet-700" : ""
        }`}
      >
        <span>Data Imports</span>
        <span>•</span>
        <span className={`text-neutral-500 group-hover:text-violet-500 ${active ? "text-violet-500" : ""}`}>
          {syncs.length}
        </span>
      </div>
    </button>
  )
}
export default forwardRef(SubtleButton)

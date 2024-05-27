import { forwardRef } from "react"

function Checkbox({ checked, disabled, className, onChange, label }, ref) {
  return (
    <label className={`flex cursor-pointer items-center ${className}`}>
      <input
        type="checkbox"
        className={`
          rounded border
          border-indigo-500 bg-indigo-50/50
          text-indigo-700 shadow-sm
          transition
          checked:border-indigo-700 checked:bg-indigo-700
          checked:text-stone-50 hover:bg-indigo-100/50 hover:text-indigo-600
          checked:hover:border-indigo-600 checked:hover:bg-indigo-600 checked:hover:text-stone-50
          disabled:border-stone-300 disabled:bg-stone-200 disabled:text-stone-300
        `}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        ref={ref}
      />
      {label && <span className={`ml-2 ${disabled ? "text-stone-300" : "text-indigo-700"}`}>{label}</span>}
    </label>
  )
}

export default forwardRef(Checkbox)

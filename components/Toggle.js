import { Switch } from "@headlessui/react"

export default function Toggle({ checked, disabled, onChange }) {
  return (
    <Switch
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      className="
        relative inline-flex h-6 w-11 items-center rounded-full
        bg-stone-300
        transition
        enabled:hover:bg-stone-200
        disabled:opacity-50
        aria-checked:bg-indigo-600
        aria-checked:enabled:hover:bg-indigo-500
      "
      data-checked={checked ? "" : null}
    >
      <span className="sr-only">Enable</span>
      <span
        className="
          inline-block h-4 w-4 translate-x-1 rounded-full bg-white transition
          data-[checked]:translate-x-6
        "
        data-checked={checked ? "" : null}
      />
    </Switch>
  )
}

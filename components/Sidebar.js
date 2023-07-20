export default function Sidebar() {
  return (
    <nav className="flex flex-col gap-2 bg-slate-700 p-4">
      <Item name="Dashboard" />
      <Item name="Explore" />
      <Item name="Trends" />
      <Item name="Reports" />
      <Item name="Data Link" selected />
      <Item name="Settings" />
    </nav>
  )
}

function Item({ name, selected }) {
  return (
    <div
      className="cursor-pointer rounded-md border-indigo-100 px-2 py-1 font-medium text-slate-100 data-[selected]:border data-[selected]:bg-slate-600"
      data-selected={selected ? "" : null}
    >
      {name}
    </div>
  )
}

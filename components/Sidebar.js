export default function Sidebar() {
  return (
    <nav className="flex flex-col gap-4 border-r border-stone-300 bg-stone-50 px-6 py-8">
      <Item name="Dashboard" />
      <Item name="Explore" />
      <Item name="Trends" />
      <Item name="Reports" />
      <Item name="Integrations" selected />
      <Item name="Settings" />
    </nav>
  )
}

function Item({ name, selected }) {
  return (
    <div
      className="cursor-pointer border-stone-900 pl-2 font-medium text-stone-900 hover:border-teal-800 hover:text-teal-800 data-[selected]:border-l-2 data-[selected]:font-bold"
      data-selected={selected ? "" : null}
    >
      {name}
    </div>
  )
}

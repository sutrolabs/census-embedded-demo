import Setup from "@components/Setup"

export default function Loading({ setup }) {
  if (setup) {
    return (
      <Setup>
        <div className="flex flex-col items-center gap-2 rounded-md border border-sky-500 bg-sky-50 px-10 py-8 shadow-md">
          <div className="text-sky-600">Loading...</div>
        </div>
      </Setup>
    )
  } else {
    return <main className="justify-self-center px-12 py-8 text-lg text-sky-500">Loading...</main>
  }
}

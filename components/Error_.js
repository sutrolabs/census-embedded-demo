import Setup from "@components/Setup"

export default function Error_({ setup, error, children }) {
  if (setup) {
    return (
      <Setup>
        <div className="flex flex-col items-center gap-4 rounded-md border border-red-500 bg-slate-100 px-10 py-8 shadow-sm">
          <div className="text-lg text-red-700">{`${error}`}</div>
          {children}
        </div>
      </Setup>
    )
  } else {
    return (
      <main className="justify-self-center px-12 py-8">
        <div className="text-lg text-red-500">{`${error}`}</div>
        {children}
      </main>
    )
  }
}

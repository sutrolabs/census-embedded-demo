export default function Footer() {
  return (
    <footer className="col-span-2 border-t border-slate-700 bg-sky-100 p-2 text-right text-sky-700">
      <strong className="font-medium">Census Embedded</strong>
      {" → "}
      <a className="text-sky-500 underline" href="https://github.com/sutrolabs/census-embedded-demo">
        demo source code
      </a>
      {" / "}
      <a className="text-sky-500 underline" href="https://developers.getcensus.com/embedded/overview">
        docs
      </a>
    </footer>
  )
}

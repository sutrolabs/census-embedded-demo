export default function Footer() {
  return (
    <footer className="col-span-2 border-t border-slate-700 bg-sky-100 p-2 text-right">
      This demo is <strong className="font-medium">Powered by Census</strong>
      {" / "}
      <a className="text-sky-600" href="https://github.com/sutrolabs/powered-by-census-demo">
        source code
      </a>
      {" / "}
      <a className="text-sky-600" href="https://docs.getcensus.com/">
        docs
      </a>
    </footer>
  )
}

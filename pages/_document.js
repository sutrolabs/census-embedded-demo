import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=optional"
        />
      </Head>
      <body className="grid h-screen grid-cols-[180px_auto] grid-rows-[auto_1fr_auto] bg-slate-100 font-inter text-slate-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

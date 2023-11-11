import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/logo.svg" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=optional"
        />
        <script src="https://kit.fontawesome.com/8010c05861.js" crossOrigin="anonymous" async></script>
      </Head>
      <body className="grid h-screen grid-cols-[180px_auto] grid-rows-[auto_1fr_auto] bg-stone-50 font-inter text-stone-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

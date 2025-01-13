import Head from "next/head"

export default function Header({ title, description }) {
  return (
    <Head>
      <title>{title ? `${title} - Marketing Magnet` : "Marketing Magnet"}</title>
      {description && <meta name="description" content={description} />}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}

import Head from "next/head"
import { useFetch } from "usehooks-ts"

import Error_ from "@components/Error_"
import Integration from "@components/Integration"
import Loading from "@components/Loading"

export default function Index({ personalAccessToken, workspaceId }) {
  const { error: destinationsError, data: destinations } = useFetch("/api/list_destinations", {
    method: "GET",
    headers: {
      ["authorization"]: `Bearer ${personalAccessToken}`,
      ["census-workspace-id"]: `${workspaceId}`,
    },
  })
  const { error: destinationConnectLinksError, data: destinationConnectLinks } = useFetch(
    "/api/list_destination_connect_links",
    {
      method: "GET",
      headers: {
        ["authorization"]: `Bearer ${personalAccessToken}`,
        ["census-workspace-id"]: `${workspaceId}`,
      },
    },
  )

  if (destinationsError || destinationConnectLinksError) {
    return <Error_ error={destinationsError ?? destinationConnectLinksError} />
  } else if (!destinations || !destinationConnectLinks) {
    return <Loading />
  }

  return (
    <>
      <Head>
        <title>Ad Platforms - Integrations - Census Embedded Demo App</title>
      </Head>
      <h2 className="text-2xl font-bold text-stone-700">Integrations / Ad Platforms</h2>
      <hr className="border-t border-stone-400" />
      <p className="text-stone-700">
        Let&apos;s make your data actionable! Here you can connect all of your personalized market data with
        the tools you use every day.
      </p>
      <Section
        name="Destinations"
        description="Use market data to build audiences that will maximize your advertising ROI:"
      >
        <Integration
          name="Google Ads"
          description="Be seen where people are searching, browsing and watching"
          type="google_ads"
          personalAccessToken={personalAccessToken}
          workspaceId={workspaceId}
          destinations={destinations}
          destinationConnectLinks={destinationConnectLinks}
        />
        <Integration
          name="Facebook Ads"
          description="Reach people as they connect with others and find communities"
          type="facebook"
          personalAccessToken={personalAccessToken}
          workspaceId={workspaceId}
          destinations={destinations}
          destinationConnectLinks={destinationConnectLinks}
        />
      </Section>
    </>
  )
}

function Section({ name, description, children }) {
  return (
    <section className="mt-2 flex flex-col gap-3">
      <h3 className="text-lg font-medium text-stone-700">{name}</h3>
      <hr className="border-t border-stone-300" />
      <p className="text-stone-700">{description}</p>
      <div className="grid grid-cols-2 gap-5">{children}</div>
    </section>
  )
}

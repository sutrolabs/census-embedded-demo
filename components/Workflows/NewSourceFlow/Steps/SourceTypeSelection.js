import Image from "next/image"

import DevelopmentMessage from "@components/Message/DevelopmentMessage"
import { EXCLUDED_SOURCE_CONNECTIONS } from "@hooks/helpers/useExclusions"
import { getLogoForSourceType } from "@hooks/useSourceLogos"
import { useSourceFlow } from "@providers/SourceFlowProvider"
import { createDevModeAttr } from "@utils/devMode"

export default function SourceTypeSelection() {
  const {
    availableSourceTypes: sourceTypes,
    loadingSourceTypes: loading,
    error,
    goToConnectSource: onSelectSourceType,
    goBack: onBack,
    embedMode,
    devMode,
    workspaceAccessToken,
  } = useSourceFlow()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-500" />
      </div>
    )
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading source types: {error}</div>
  }

  // Filter source types based on both excludedConnections and creatable_via_connect_link
  const filteredSourceTypes = sourceTypes.filter((sourceType) => {
    // First check if it's in the excluded list
    if (EXCLUDED_SOURCE_CONNECTIONS.includes(sourceType.service_name)) {
      return false
    }

    return sourceType.creatable_via_connect_link === true
  })

  return (
    <div className="h-full overflow-hidden">
      <div className="relative flex h-full flex-col gap-3 overflow-y-auto">
        <div className="rounded bg-neutral-50 p-4">
          <p className="mb-2">Connect your source account to import your data.</p>
          <p className="text-sm text-neutral-600">
            {embedMode
              ? "You'll be guided through a secure connection process."
              : "You'll be redirected to Census to securely connect your account."}
          </p>
        </div>

        <div
          className="grid grid-cols-2 gap-4"
          {...(devMode && embedMode === true
            ? createDevModeAttr({
                url: `https://app.getcensus.com/api/v1/source_types`,
                method: "GET",
                headers: `Authorization: Bearer <workspaceAccessToken>`,
                note: "Lists available source types",
                link: "https://developers.getcensus.com/api-reference/sources/list-source-types",
              })
            : {})}
          {...(devMode && embedMode === false
            ? createDevModeAttr({
                url: `https://app.getcensus.com/api/v1/source_connect_links`,
                method: "GET",
                headers: `Authorization: Bearer <workspaceAccessToken>`,
                note: "Lists available source connect links",
                link: "https://developers.getcensus.com/api-reference/source-connect-links/list-source-connect-links",
              })
            : {})}
        >
          {filteredSourceTypes.map((sourceType) => {
            const logo = getLogoForSourceType(sourceType)

            return (
              <div
                key={sourceType.service_name}
                className="group flex cursor-pointer items-center rounded-md border p-4 hover:bg-neutral-100"
                onClick={() => onSelectSourceType(sourceType)}
              >
                <div className="flex items-center gap-3">
                  {logo && (
                    <Image
                      src={logo}
                      alt={`${sourceType.label} logo`}
                      width={20}
                      height={20}
                      className="h-5 object-contain"
                    />
                  )}
                  <div className="font-medium">{sourceType.label}</div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="fixed inset-x-0 bottom-0 flex w-full shrink-0 bg-gradient-to-t from-white to-transparent px-6 pb-4 pt-9">
          <DevelopmentMessage
            message="Toggle 'embedded components' in the sidebar to see how this feature will look as an embedded experience or a redirect."
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}

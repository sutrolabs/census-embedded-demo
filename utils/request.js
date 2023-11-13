export function getSearchParams(req) {
  return Object.fromEntries(new URL(req.url, "http://ignored").searchParams.entries())
}

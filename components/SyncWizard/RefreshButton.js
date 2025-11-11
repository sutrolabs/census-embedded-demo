import Button from "@components/Button/Button/Button"

export default function RefreshButton({ onRefresh, isRefreshing, label = "Refresh" }) {
  return (
    <Button
      onClick={onRefresh}
      disabled={isRefreshing}
      className="flex items-center gap-2"
      size="small"
    >
      <i className={`fa-solid fa-rotate ${isRefreshing ? "fa-spin" : ""}`} />
      {isRefreshing ? "Refreshing..." : label}
    </Button>
  )
}

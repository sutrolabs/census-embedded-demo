export default function MainLayout({ children }) {
  return (
    <div className="flex h-full grow flex-col items-center overflow-hidden bg-white">
      <div className="flex h-full w-full flex-col overflow-hidden">{children}</div>
    </div>
  )
}

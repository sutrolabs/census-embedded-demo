export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col items-center overflow-y-auto">
      <main className="flex w-full max-w-[1000px] flex-col gap-4 p-4 sm:px-12 sm:py-8">{children}</main>
    </div>
  )
}

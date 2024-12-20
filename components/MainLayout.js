export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col items-center md:w-3/5 xl:w-3/4">
      <div className="flex w-full max-w-[1200px] flex-col gap-4 p-4 sm:p-8">{children}</div>
    </div>
  )
}

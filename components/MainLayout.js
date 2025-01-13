export default function MainLayout({ children }) {
  return (
    <div className="flex grow flex-col items-center">
      <div className="mx-auto flex w-full  max-w-[1200px] flex-col gap-4 p-4 sm:p-8">{children}</div>
    </div>
  )
}

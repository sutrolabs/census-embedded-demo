export default function MainLayout({ children }) {
  return (
    <div className="flex grow flex-col items-center bg-white">
      <div className=" flex w-full flex-col">{children}</div>
    </div>
  )
}

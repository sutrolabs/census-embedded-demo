export default function DevelopmentMessage({ message }) {
  return (
    <div className="relative flex items-center gap-2 overflow-hidden rounded-md border border-neutral-100 bg-white text-xs shadow shadow-[#4640EB]/20">
      <div className="z-20 flex flex-col px-3 py-2">
        <span className="font-medium text-[#4640EB]">Census Embedded Tip</span>
        <span className="text-neutral-700">{message}</span>
      </div>
      <div className="bg-brand-development absolute inset-0 -z-0 h-full w-full" />
    </div>
  )
}

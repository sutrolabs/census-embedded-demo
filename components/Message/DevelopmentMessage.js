export default function DevelopmentMessage({ message }) {
  return (
    <div className="relative flex items-center gap-2 rounded-md border border-neutral-100 bg-white text-xs shadow shadow-[#F36812]/20">
      <div className="z-20 flex flex-col px-3 py-2">
        <span className="font-medium text-[#F36812]">Dev Note</span>
        <span className="text-neutral-700">{message}</span>
      </div>
      <div className="bg-development-warning absolute inset-0 -z-0 h-full w-full [mask-image:linear-gradient(transparent_0%,black)]" />
    </div>
  )
}

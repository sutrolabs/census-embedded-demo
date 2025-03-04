import { Text } from "@radix-ui/themes"

export default function Header({ title, children }) {
  return (
    <div className="flex h-14 w-full flex-row items-center justify-between border-b border-neutral-100 bg-white px-8 py-4">
      <Text className="text-lg font-medium leading-none">{title}</Text>
      <div>{children}</div>
    </div>
  )
}

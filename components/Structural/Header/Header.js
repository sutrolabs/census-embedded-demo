import { Text } from "@radix-ui/themes"

export default function Header({ title, description }) {
  return (
    <div className="w-full border-b border-neutral-200 bg-white px-8 py-4">
      <Text className="text-lg font-medium leading-none">{title}</Text>
    </div>
  )
}

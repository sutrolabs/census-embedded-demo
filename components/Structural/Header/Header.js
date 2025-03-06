import { Text } from "@radix-ui/themes"

import Button from "@components/Button/Button/Button"

export default function Header({ title, nestedPage, backButtonClick }) {
  return (
    <div className="flex h-14 w-full flex-row items-center gap-6 border-b border-neutral-100 bg-white px-8 py-4">
      {nestedPage && (
        <Button onClick={backButtonClick}>
          <i className="fa-regular fa-chevron-left" />
        </Button>
      )}
      <div className="flex flex-row gap-3 text-lg leading-none">
        <Text className=" font-medium">{title}</Text>
        {nestedPage && (
          <>
            <Text>/</Text>
            <Text>{nestedPage}</Text>
          </>
        )}
      </div>
    </div>
  )
}

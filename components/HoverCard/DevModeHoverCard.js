import { HoverCard, HoverCardContent, HoverCardTrigger } from "@components/HoverCard/HoverCard"

export default function DevModeHoverCard(trigger, children, className) {
  return (
    <HoverCard>
      <HoverCardTrigger>{trigger}</HoverCardTrigger>
      <HoverCardContent>{children}</HoverCardContent>
    </HoverCard>
  )
}

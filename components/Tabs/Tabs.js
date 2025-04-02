"use client"

import * as TabsPrimitive from "@radix-ui/react-tabs"
import classNames from "classnames"
import * as React from "react"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={classNames(
      "inline-flex w-full items-center justify-center border-b  border-neutral-100 bg-white px-4",
      className,
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={classNames(
      "focus-visible:ring-ring inline-flex w-1/2 min-w-fit items-center justify-center whitespace-nowrap border-b-2 border-transparent px-3 pb-4 pt-6 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-emerald-600 data-[state=inactive]:opacity-50 data-[state=inactive]:hover:border-neutral-400 data-[state=inactive]:hover:opacity-100",
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={classNames(
      "ring-offset-background focus-visible:ring-ring mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }

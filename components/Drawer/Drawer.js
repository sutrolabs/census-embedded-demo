"use client"

import classNames from "classnames"
import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

const Drawer = ({ shouldScaleBackground = true, dismissible, open, ...props }) => (
  <DrawerPrimitive.Root
    open={open}
    shouldScaleBackground={shouldScaleBackground}
    dismissible={dismissible}
    {...props}
  />
)
Drawer.displayName = "Drawer"

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerClose = DrawerPrimitive.Close

const DrawerOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={classNames("fixed inset-0 z-50 bg-black/10", className)}
    {...props}
  />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const DrawerContent = React.forwardRef(({ className, direction, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={classNames(
        "pointer-events-auto fixed z-50 flex h-auto flex-col border border-neutral-100 bg-white shadow-xl",
        direction === "right"
          ? "bottom-0 right-0 top-0 w-2/3 max-w-[1200px] rounded-l-[10px]"
          : "inset-x-0 bottom-0 mt-24 rounded-t-[10px]",
        className,
      )}
      {...props}
    >
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
))
DrawerContent.displayName = "DrawerContent"

const DrawerHeader = ({ className, ...props }) => (
  <div
    className={classNames(
      "flex flex-row items-center justify-between gap-1.5 border-b border-neutral-100 p-4 text-center sm:text-left",
      className,
    )}
    {...props}
  />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({ className, ...props }) => (
  <div
    className={classNames("mt-auto flex flex-row gap-2 border-t border-neutral-100 p-4", className)}
    {...props}
  />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={classNames("text-lg font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={classNames("text-muted-foreground text-sm", className)}
    {...props}
  />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}

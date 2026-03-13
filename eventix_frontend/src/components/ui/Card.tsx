import * as React from "react"
import { cn } from "./Button"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "premium" }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border transition-all duration-300",
      // Default Styles
      variant === "default" && "bg-card text-card-foreground shadow-sm border-border",

      // Premium Styles: Light background to make BLACK text visible
      // Added a Red shadow/glow so it doesn't "disappear" into the dark page
      variant === "premium" && "bg-white border-[#FF3333]/30 shadow-[0_0_20px_rgba(255,51,51,0.15)] hover:shadow-[0_0_30px_rgba(255,51,51,0.3)]",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  // text-black forced here
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6 text-black", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  // Forced text-black and bold
  <h3 ref={ref} className={cn("text-2xl font-bold leading-none tracking-tight font-heading text-black", className)} {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-black/60", className)} {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  // text-black forced to ensure visibility on white card
  <div ref={ref} className={cn("p-6 pt-0 text-black", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0 text-black", className)} {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
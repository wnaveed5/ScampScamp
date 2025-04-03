
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  orientation?: "horizontal" | "vertical"
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, orientation = "horizontal", ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative overflow-hidden rounded-full bg-secondary",
      orientation === "vertical" ? "w-1 h-24" : "h-4 w-full",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn("flex-1 bg-primary transition-all", 
        orientation === "vertical" ? "h-full w-full" : "h-full w-full"
      )}
      style={
        orientation === "vertical"
          ? { transform: `translateY(${100 - (value || 0)}%)` }
          : { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }

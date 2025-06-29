import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const COLOR_CLASSES = {
  "red-600": "bg-red-600",
  "green-600": "bg-green-600",
  "yellow-500": "bg-yellow-500",
} as const;

type ColorKey = keyof typeof COLOR_CLASSES

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  color?: ColorKey
}

function Progress({
  className,
  value,
  color,
  ...props
}: ProgressProps) {
  const indicatorBg = color ? COLOR_CLASSES[color] : "bg-primary"

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn("h-full w-full flex-1 transition-all duration-500", indicatorBg)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }

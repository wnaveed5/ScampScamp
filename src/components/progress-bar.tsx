import type React from "react"
import { Progress } from "@/components/ui/progress"

interface ProgressBarProps {
  value: number
  max: number
  orientation?: "horizontal" | "vertical"
  className?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, orientation = "vertical", className = "" }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  if (orientation === "vertical") {
    return (
      <div className={`progress-vertical bg-muted/30 ${className}`} style={{ height: "100%", width: "2px" }}>
        <div
          className="progress-vertical-indicator bg-white"
          style={{
            height: `${percentage}%`,
            width: "100%",
          }}
        />
      </div>
    )
  }

  return <Progress value={percentage} className={className} />
}

export default ProgressBar 
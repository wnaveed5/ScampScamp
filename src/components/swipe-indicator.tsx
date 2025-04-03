"use client"

import type React from "react"

const SwipeIndicator: React.FC<{
  onClick?: () => void
  direction?: "up" | "down"
  className?: string
}> = ({ onClick, direction = "down", className = "" }) => {
  const handleClick = (e: React.MouseEvent) => {
    // Prevent default behavior
    e.preventDefault()
    e.stopPropagation()

    // Call the onClick handler if provided
    if (onClick) {
      onClick()
    }
  }

  const handleTouch = (e: React.TouchEvent) => {
    // Prevent default behavior
    e.preventDefault()
    e.stopPropagation()

    // Call the onClick handler if provided
    if (onClick) {
      onClick()
    }
  }

  return (
    <div
      className={`absolute z-20 cursor-pointer ${
        direction === "up" ? "animate-bounce-reverse top-8" : "animate-bounce bottom-8"
      } right-8 ${className}`}
      style={{
        opacity: 0.85,
        touchAction: "manipulation",
      }}
      onClick={handleClick}
      onTouchEnd={handleTouch}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={direction === "up" ? "rotate-180" : ""}
      >
        <path
          d="M12 5V19M12 19L5 12M12 19L19 12"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export default SwipeIndicator 
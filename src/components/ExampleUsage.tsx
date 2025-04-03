"use client"

import { useState } from "react"
import SwipeIndicator from "./swipe-indicator"
import ProgressBar from "./progress-bar"

export default function ExampleUsage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = 5

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0))
  }

  return (
    <div className="relative h-screen w-full bg-gray-900 text-white overflow-hidden">
      {/* Content area */}
      <div className="h-full w-full flex items-center justify-center">
        <h1 className="text-4xl font-bold">
          Slide {currentSlide + 1} of {totalSlides}
        </h1>
      </div>

      {/* Progress bar - positioned on the right side */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 h-1/2">
        <ProgressBar value={currentSlide + 1} max={totalSlides} orientation="vertical" />
      </div>

      {/* A24-style navigation arrows */}
      {currentSlide > 0 && <SwipeIndicator onClick={prevSlide} direction="up" />}

      {currentSlide < totalSlides - 1 && <SwipeIndicator onClick={nextSlide} direction="down" />}
    </div>
  )
} 
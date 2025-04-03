
import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";

interface SliderProgressProps {
  totalSlides: number;
  currentSlide: number;
  progress: number;
  timeRemaining: number;
}

const SliderProgress: React.FC<SliderProgressProps> = ({ 
  totalSlides, 
  currentSlide, 
  progress,
  timeRemaining 
}) => {
  return (
    <div className="absolute bottom-8 left-8 z-10 flex flex-col gap-2 w-36">
      <div className="flex justify-between text-white text-sm">
        <span className="font-medium">{String(currentSlide+1).padStart(2, '0')}/{String(totalSlides).padStart(2, '0')}</span>
        <span>{Math.ceil(timeRemaining)}s</span>
      </div>
      <Progress value={progress} className="h-1 bg-white/30" />
    </div>
  );
};

export default SliderProgress;

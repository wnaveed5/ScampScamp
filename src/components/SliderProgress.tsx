
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface SliderProgressProps {
  totalSlides: number;
  currentSlide: number;
  progress: number;
}

const SliderProgress: React.FC<SliderProgressProps> = ({ 
  totalSlides, 
  currentSlide, 
  progress
}) => {
  return (
    <div className="absolute bottom-8 right-8 z-10 flex gap-4 items-center">
      <div className="text-white text-sm font-medium">
        <span>{String(currentSlide+1).padStart(2, '0')}/{String(totalSlides).padStart(2, '0')}</span>
      </div>
      <Progress value={progress} className="h-24 w-1 bg-white/30 [&>div]:bg-white" orientation="vertical" />
    </div>
  );
};

export default SliderProgress;

import React from 'react';
import { motion } from 'framer-motion';

interface WaveformAnimationProps {
  isActive: boolean;
  barCount?: number;
  className?: string;
  color?: string;
}

const WaveformAnimation: React.FC<WaveformAnimationProps> = ({
  isActive,
  barCount = 5,
  className = '',
  color = 'bg-primary',
}) => {
  const bars = Array.from({ length: barCount }, (_, i) => i);

  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      {bars.map((index) => (
        <motion.div
          key={index}
          className={`w-1 rounded-full ${color}`}
          initial={{ height: 8 }}
          animate={
            isActive
              ? {
                  height: [8, 24, 12, 32, 8],
                  transition: {
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    delay: index * 0.1,
                    ease: 'easeInOut',
                  },
                }
              : { height: 8 }
          }
        />
      ))}
    </div>
  );
};

export default WaveformAnimation;

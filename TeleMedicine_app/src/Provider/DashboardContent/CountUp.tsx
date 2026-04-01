import React, { useEffect, useRef } from "react";

interface CountUpProps {
  end: number;
  duration?: number;
}

const CountUp: React.FC<CountUpProps> = ({ end, duration = 1500 }) => {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let startTime: number | null = null;
    const element = spanRef.current;

    if (!element) return;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // "Ease Out Expo" formula: Starts fast, slows down perfectly at the end
      const easedProgress = 1 - Math.pow(1 - progress, 2);

      const currentCount = Math.floor(easedProgress * end);

      // HIGH PERFORMANCE: Direct update bypassing React's render cycle
      if (element) {
        element.innerText = currentCount.toString();
      }

      if (progress < 1) {
        window.requestAnimationFrame(animate);
      } else{
        element.innerText = end.toString();
      }
    };

    const animationId = window.requestAnimationFrame(animate);

    // Cleanup to prevent memory leaks if the user leaves the page
    return () => window.cancelAnimationFrame(animationId);
  }, [end, duration]);

  return <span ref={spanRef}>0</span>;
};

export default CountUp;

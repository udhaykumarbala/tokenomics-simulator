"use client";

import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { useReducedMotion } from 'framer-motion';

interface ConfettiProps {
  trigger?: boolean;
  duration?: number;
  particleCount?: number;
  spread?: number;
  origin?: { x: number; y: number };
}

export default function Confetti({
  trigger = true,
  duration = 3000,
  particleCount = 150,
  spread = 90,
  origin = { x: 0.5, y: 0.3 }  // Start from top center of screen
}: ConfettiProps) {
  const [isActive, setIsActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();
  
  useEffect(() => {
    // Skip animation if user prefers reduced motion
    if (prefersReducedMotion) return;
    
    // Only trigger once when the component mounts and trigger is true
    if (trigger && !isActive) {
      setIsActive(true);
      
      if (canvasRef.current) {
        const myCanvas = confetti.create(canvasRef.current, {
          resize: true,
          useWorker: true
        });
        
        // Fire confetti twice for a fuller effect
        const fire = () => {
          myCanvas({
            particleCount,
            spread,
            origin,
            gravity: 1.2,
            ticks: 150,
            startVelocity: 35,
            colors: ['#5B8DEF', '#38BDF8', '#818CF8', '#A78BFA', '#F472B6', '#34D399', '#FCD34D'],
            shapes: ['circle', 'square'],
            scalar: 1.2
          });
        };
        
        // Fire twice with a slight delay for a more natural effect
        fire();
        setTimeout(fire, 250);

        const timeout = setTimeout(() => {
          myCanvas.reset();
        }, duration);

        return () => {
          clearTimeout(timeout);
          myCanvas.reset();
        };
      }
    }
  }, [trigger, isActive, duration, particleCount, spread, origin, prefersReducedMotion]);

  // Only render canvas if user doesn't prefer reduced motion
  if (prefersReducedMotion) return null;

  return (
    <div className="confetti-container fixed inset-0 pointer-events-none z-50">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { GlossaryTerm } from '@/lib/glossary';

interface TooltipProps {
  term: GlossaryTerm;
  children: React.ReactNode;
}

export default function Tooltip({ term, children }: TooltipProps) {
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setTooltipVisible(true);
  };
  
  const handleMouseLeave = () => {
    // Small delay to prevent tooltip from disappearing immediately
    timeoutRef.current = setTimeout(() => {
      setTooltipVisible(false);
    }, 200);
  };

  return (
    <span 
      className="glossary-term relative inline"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      onClick={handleMouseEnter}  // Add click event for mobile users
      tabIndex={0}
      aria-describedby={`tooltip-${term.term.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <span className="border-dotted border-b border-primary cursor-help">
        {children}
      </span>
      
      {isTooltipVisible && (
        <motion.div
          id={`tooltip-${term.term.replace(/\s+/g, '-').toLowerCase()}`}
          className="absolute z-50 bg-white dark:bg-gray-800 shadow-lg rounded-md p-3 
            text-sm w-64 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          style={{
            bottom: 'calc(100% + 10px)',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
          role="tooltip"
        >
          <div className="font-medium text-primary dark:text-primary mb-1">{term.term}</div>
          <div className="text-gray-700 dark:text-gray-300">{term.definition}</div>
          
          {/* Close button - visible on touch devices */}
          <button 
            className="absolute top-2 right-2 w-5 h-5 text-gray-400 hover:text-gray-600 hidden sm:hidden touch-device-block"
            onClick={(e) => {
              e.stopPropagation();
              setTooltipVisible(false);
            }}
            aria-label="Close tooltip"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Arrow */}
          <div 
            className="absolute w-3 h-3 bg-white dark:bg-gray-800 border-r border-b border-gray-200 
              dark:border-gray-700 transform rotate-45"
            style={{
              bottom: '-6px',
              left: 'calc(50% - 6px)',
            }}
          />
        </motion.div>
      )}
    </span>
  );
}
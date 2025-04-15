'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function LoadingSpinner({ size = 'medium', color = 'blue', fullScreen = false, text = 'Loading...' }) {
  const spinnerRef = useRef(null);
  const coin1Ref = useRef(null);
  const coin2Ref = useRef(null);
  const coin3Ref = useRef(null);
  const textRef = useRef(null);
  
  // Size class mapping
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };
  
  // Color class mapping
  const colorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    red: 'text-red-500',
    purple: 'text-purple-500',
    yellow: 'text-yellow-500'
  };
  
  // Animation
  useEffect(() => {
    if (spinnerRef.current) {
      gsap.to(spinnerRef.current, {
        rotation: 360,
        duration: 2,
        repeat: -1,
        ease: 'linear'
      });
    }
    
    if (coin1Ref.current && coin2Ref.current && coin3Ref.current) {
      gsap.to(coin1Ref.current, {
        y: -6,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
      
      gsap.to(coin2Ref.current, {
        y: -6,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.2
      });
      
      gsap.to(coin3Ref.current, {
        y: -6,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.4
      });
    }
    
    if (textRef.current) {
      gsap.to(textRef.current, {
        opacity: 0.5,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }
  }, []);
  
  // Wrapper classes
  const wrapperClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white/75 dark:bg-gray-900/75 z-50'
    : 'flex flex-col items-center justify-center py-8';
  
  return (
    <div className={wrapperClasses}>
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg 
            ref={spinnerRef} 
            className={`${sizeClasses[size]} ${colorClasses[color]}`} 
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="8" 
              strokeDasharray="283" 
              strokeDashoffset="60" 
              strokeLinecap="round" 
            />
          </svg>
          
          <svg 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
            width={size === 'small' ? 24 : size === 'medium' ? 48 : 64}
            height={size === 'small' ? 24 : size === 'medium' ? 48 : 64}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Coin 1 */}
            <g ref={coin1Ref} transform="translate(30, 30)">
              <circle cx="0" cy="0" r="15" fill="#fbbf24" />
              <circle cx="0" cy="0" r="10" fill="#f59e0b" />
              <text x="-4" y="4" fontSize="12" fill="white" fontWeight="bold">$</text>
            </g>
            
            {/* Coin 2 */}
            <g ref={coin2Ref} transform="translate(50, 50)">
              <circle cx="0" cy="0" r="15" fill="#fbbf24" />
              <circle cx="0" cy="0" r="10" fill="#f59e0b" />
              <text x="-4" y="4" fontSize="12" fill="white" fontWeight="bold">$</text>
            </g>
            
            {/* Coin 3 */}
            <g ref={coin3Ref} transform="translate(70, 30)">
              <circle cx="0" cy="0" r="15" fill="#fbbf24" />
              <circle cx="0" cy="0" r="10" fill="#f59e0b" />
              <text x="-4" y="4" fontSize="12" fill="white" fontWeight="bold">$</text>
            </g>
          </svg>
        </div>
        
        {text && (
          <p 
            ref={textRef} 
            className={`mt-4 font-medium ${colorClasses[color]}`}
          >
            {text}
          </p>
        )}
      </div>
    </div>
  );
} 
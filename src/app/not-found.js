'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';

export default function NotFound() {
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const buttonRef = useRef(null);
  const svgRef = useRef(null);
  
  useEffect(() => {
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    timeline.fromTo(
      titleRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 }
    ).fromTo(
      textRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.3'
    ).fromTo(
      svgRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8 },
      '-=0.3'
    ).fromTo(
      buttonRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      '-=0.2'
    );
    
    // Animate 404 SVG elements
    gsap.to('#coin1', {
      y: -15,
      rotation: 5,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
    
    gsap.to('#coin2', {
      y: -10,
      rotation: -5,
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.2
    });
    
    gsap.to('#coin3', {
      y: -12,
      rotation: 7,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.4
    });
    
    gsap.to('#wallet', {
      y: 8,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
    
    gsap.to('#questionmark1', {
      y: -10,
      rotation: 10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
    
    gsap.to('#questionmark2', {
      y: -8,
      rotation: -8,
      duration: 2.3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 0.3
    });
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-3xl w-full text-center">
        <h1 ref={titleRef} className="text-6xl md:text-8xl font-bold text-gray-800 dark:text-white mb-4">
          4<span className="text-blue-500">0</span>4
        </h1>
        
        <p ref={textRef} className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
          Oops! We couldn't find the financial page you were looking for.
        </p>
        
        <div ref={svgRef} className="w-full max-w-lg mx-auto mb-12">
          <svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
            {/* Empty wallet */}
            <g id="wallet">
              <rect x="200" y="100" width="200" height="150" rx="20" fill="#3b82f6" />
              <rect x="210" y="110" width="180" height="130" rx="15" fill="#1e40af" />
              <rect x="210" y="90" width="180" height="30" rx="10" fill="#60a5fa" />
            </g>
            
            {/* Question marks */}
            <text id="questionmark1" x="350" y="120" fontSize="60" fill="#dbeafe" fontWeight="bold">?</text>
            <text id="questionmark2" x="270" y="180" fontSize="80" fill="#dbeafe" fontWeight="bold">?</text>
            
            {/* Coins */}
            <circle id="coin1" cx="150" cy="200" r="40" fill="#fbbf24" />
            <circle id="coin1-inner" cx="150" cy="200" r="30" fill="#f59e0b" />
            <text x="140" y="210" fontSize="24" fill="white" fontWeight="bold">$</text>
            
            <circle id="coin2" cx="450" cy="150" r="35" fill="#fbbf24" />
            <circle id="coin2-inner" cx="450" cy="150" r="25" fill="#f59e0b" />
            <text x="440" y="158" fontSize="20" fill="white" fontWeight="bold">$</text>
            
            <circle id="coin3" cx="400" cy="250" r="30" fill="#fbbf24" />
            <circle id="coin3-inner" cx="400" cy="250" r="20" fill="#f59e0b" />
            <text x="392" y="257" fontSize="18" fill="white" fontWeight="bold">$</text>
          </svg>
        </div>
        
        <Link href="/" passHref>
          <button
            ref={buttonRef}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 text-lg font-medium"
          >
            Return to Home
          </button>
        </Link>
      </div>
    </div>
  );
} 
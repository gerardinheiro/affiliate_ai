"use client"

import React from "react"

export function Logo3D({ className = "w-12 h-12" }: { className?: string }) {
    return (
        <div className={`relative group ${className}`}>
            {/* Glow Effects */}
            <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full group-hover:bg-yellow-500/40 transition-all duration-500 animate-pulse" />
            <div className="absolute inset-0 bg-red-600/10 blur-2xl rounded-full group-hover:bg-red-600/30 transition-all duration-700 animate-pulse delay-75" />

            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 w-full h-full drop-shadow-2xl transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
            >
                <defs>
                    {/* 3D Depth Gradient - Yellow to Black */}
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#facc15" /> {/* Yellow-400 */}
                        <stop offset="50%" stopColor="#eab308" /> {/* Yellow-500 */}
                        <stop offset="100%" stopColor="#000000" /> {/* Black */}
                    </linearGradient>

                    {/* Red Energy Detail */}
                    <radialGradient id="redEnergy" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ef4444" /> {/* Red-500 */}
                        <stop offset="100%" stopColor="#7f1d1d" /> {/* Red-900 */}
                    </radialGradient>

                    {/* 3D Filter */}
                    <filter id="f1" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                        <feOffset in="blur" dx="2" dy="2" result="offsetBlur" />
                        <feSpecularLighting in="blur" surfaceScale="5" specularConstant=".75" specularExponent="20" lightingColor="#ffffff" result="specOut">
                            <fePointLight x="-5000" y="-10000" z="20000" />
                        </feSpecularLighting>
                        <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
                        <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litGraphic" />
                        <feMerge>
                            <feMergeNode in="offsetBlur" />
                            <feMergeNode in="litGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Base Shape (Stylized A / Network Node) */}
                <path
                    d="M50 5 L85 85 L50 70 L15 85 Z"
                    fill="url(#logoGradient)"
                    filter="url(#f1)"
                    stroke="#ffffff"
                    strokeWidth="1"
                    strokeOpacity="0.3"
                />

                {/* Red Energy Lines (The "Detail") */}
                <path
                    d="M50 10 L80 80 M50 10 L20 80"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeOpacity="0.6"
                    className="animate-pulse"
                />

                {/* Inner Detail (White Highlight) */}
                <path
                    d="M50 20 L70 75 L50 65 L30 75 Z"
                    fill="white"
                    fillOpacity="0.1"
                    stroke="white"
                    strokeWidth="0.5"
                    strokeDasharray="2 2"
                />

                {/* Red Core (The "Detail") */}
                <circle cx="50" cy="55" r="8" fill="url(#redEnergy)" className="animate-pulse">
                    <animate attributeName="r" values="6;10;6" dur="1.5s" repeatCount="indefinite" />
                </circle>

                {/* White Sparkle */}
                <circle cx="45" cy="40" r="1.5" fill="white" className="animate-twinkle" />

                {/* Red Orbit Ring */}
                <ellipse
                    cx="50"
                    cy="55"
                    rx="38"
                    ry="18"
                    stroke="#ef4444"
                    strokeWidth="0.8"
                    strokeDasharray="4 8"
                    className="animate-spin-slow origin-center"
                    style={{ transformOrigin: '50px 55px', animation: 'spin 8s linear infinite' }}
                />

                {/* Yellow Orbit Ring (Replaced Blue) */}
                <ellipse
                    cx="50"
                    cy="55"
                    rx="35"
                    ry="15"
                    stroke="#eab308"
                    strokeWidth="1"
                    strokeDasharray="5 10"
                    className="animate-spin-slow origin-center"
                    style={{ transformOrigin: '50px 55px', animation: 'spin 12s linear infinite reverse' }}
                />
            </svg>

            <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
        </div>
    )
}

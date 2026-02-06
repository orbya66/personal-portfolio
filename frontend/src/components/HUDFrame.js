import React from 'react';

export const HUDFrame = ({ children, className = '', scanline = true }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF4D00]" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FF4D00]" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FF4D00]" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF4D00]" />

      {scanline && (
        <div className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FF4D00]/50 to-transparent animate-scan" />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
};

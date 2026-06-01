import React, { useState, useRef, useEffect } from 'react';

const Preloader = ({ onComplete }) => {
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef(null);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const { currentTime } = videoRef.current;
      // Start fading out at 6 seconds so it smoothly vanishes before 7 seconds
      if (currentTime >= 6.0 && !isFading) {
        setIsFading(true);
      }
    }
  };

  const handleEnded = () => {
    // Ensure onComplete is called after fade out transition completes
    setTimeout(() => {
      onComplete();
    }, 500); 
  };

  // Fallback in case video fails to load or play
  useEffect(() => {
    const fallbackTimeout = setTimeout(() => {
      if (videoRef.current && videoRef.current.currentTime === 0) {
        setIsFading(true);
        setTimeout(onComplete, 1000);
      }
    }, 5000); // 5 seconds max wait before fallback

    return () => clearTimeout(fallbackTimeout);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-[#000000] flex items-center justify-center transition-opacity duration-1000 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
    >
      <video
        ref={videoRef}
        src="/assets/preloader.mp4"
        autoPlay
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default Preloader;

import React from 'react';

export default function FilmReel3D() {
  return (
    <div className="relative w-40 h-40 flex items-center justify-center pointer-events-none select-none perspective-[1000px] mb-4">
      <style>{`
        @keyframes spin3D {
          0% { transform: rotateX(15deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(15deg) rotateY(360deg) rotateZ(360deg); }
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
      
      {/* 3D Container Wrapper */}
      <div 
        className="w-28 h-28 relative preserve-3d"
        style={{
          animation: 'spin3D 10s linear infinite'
        }}
      >
        {/* Front Plate of Reel */}
        <div 
          className="absolute inset-0 rounded-full border-[5px] border-accent bg-cinema-black/95 flex items-center justify-center preserve-3d shadow-[0_0_25px_rgba(255,159,28,0.25)]"
          style={{ transform: 'translateZ(10px)' }}
        >
          {/* Inner details / spokes of the reel */}
          <div className="absolute w-20 h-20 rounded-full border border-accent/40 flex items-center justify-center">
            {/* Spokes */}
            <div className="absolute w-[1.5px] h-full bg-accent/60 transform rotate-0" />
            <div className="absolute w-[1.5px] h-full bg-accent/60 transform rotate-45" />
            <div className="absolute w-[1.5px] h-full bg-accent/60 transform rotate-90" />
            <div className="absolute w-[1.5px] h-full bg-accent/60 transform rotate-135" />
            {/* Center Cap */}
            <div className="absolute w-6 h-6 rounded-full bg-accent border border-white flex items-center justify-center z-10 shadow-inner">
              <div className="w-1.5 h-1.5 rounded-full bg-cinema-black" />
            </div>
          </div>
        </div>

        {/* Center Cylinder (Core) */}
        <div 
          className="absolute inset-[24px] rounded-full bg-gradient-to-r from-accent to-accent-hover/80 border border-accent/40 preserve-3d"
          style={{ transform: 'translateZ(0px) scaleZ(1.8)' }}
        />

        {/* Back Plate of Reel */}
        <div 
          className="absolute inset-0 rounded-full border-[5px] border-accent/60 bg-cinema-black/90 flex items-center justify-center preserve-3d"
          style={{ transform: 'translateZ(-10px)' }}
        >
          <div className="absolute w-20 h-20 rounded-full border border-accent/20 flex items-center justify-center">
            <div className="absolute w-[1.5px] h-full bg-accent/30 transform rotate-0" />
            <div className="absolute w-[1.5px] h-full bg-accent/30 transform rotate-45" />
            <div className="absolute w-[1.5px] h-full bg-accent/30 transform rotate-90" />
            <div className="absolute w-[1.5px] h-full bg-accent/30 transform rotate-135" />
            <div className="absolute w-6 h-6 rounded-full bg-accent/70 border border-white/40 flex items-center justify-center z-10">
              <div className="w-1.5 h-1.5 rounded-full bg-cinema-black" />
            </div>
          </div>
        </div>

        {/* Inner Film Strip spiral visual shadow */}
        <div 
          className="absolute inset-[10px] rounded-full border-2 border-dashed border-accent/30 preserve-3d"
          style={{ transform: 'translateZ(3px)' }}
        />
        <div 
          className="absolute inset-[10px] rounded-full border-2 border-dashed border-accent/15 preserve-3d"
          style={{ transform: 'translateZ(-3px)' }}
        />
      </div>
    </div>
  );
}

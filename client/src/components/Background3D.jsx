import React from 'react';

export default function Background3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none perspective-[1200px]">
      <style>{`
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotateX(10deg) rotateY(0deg) rotateZ(0deg); }
          50% { transform: translateY(-40px) rotateX(20deg) rotateY(180deg) rotateZ(45deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotateX(25deg) rotateY(45deg) rotateZ(0deg); }
          50% { transform: translateY(35px) rotateX(-15deg) rotateY(225deg) rotateZ(-30deg); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(180deg) rotateZ(0deg); }
          50% { transform: translateY(-25px) rotateX(30deg) rotateY(360deg) rotateZ(60deg); }
        }
        @keyframes grid-pulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.35; }
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>

      {/* Cybernetic Ambient Grid Pattern */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(#1e1e24_1px,transparent_1px)] [background-size:32px_32px] opacity-25"
        style={{ animation: 'grid-pulse 8s ease-in-out infinite' }}
      />

      {/* Subtle Vignette Mask */}
      <div className="absolute inset-0 bg-radial from-transparent via-cinema-black/40 to-cinema-black pointer-events-none" />

      {/* Object 1: 3D Film Reel - Top Left */}
      <div 
        className="absolute top-[25vh] left-[4%] w-28 h-28 preserve-3d opacity-[0.07] hidden lg:block"
        style={{ animation: 'float-1 25s ease-in-out infinite' }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-accent bg-transparent preserve-3d">
          <div className="absolute inset-0 rounded-full border border-dashed border-accent/60" style={{ transform: 'translateZ(6px)' }} />
          <div className="absolute inset-0 rounded-full border border-dashed border-accent/30" style={{ transform: 'translateZ(-6px)' }} />
          <div className="absolute w-[2px] h-full bg-accent/50 left-1/2 transform -translate-x-1/2" />
          <div className="absolute h-[2px] w-full bg-accent/50 top-1/2 transform -translate-y-1/2" />
        </div>
        <div className="absolute inset-0 rounded-full border-4 border-accent bg-transparent preserve-3d" style={{ transform: 'translateZ(12px)' }} />
        <div className="absolute inset-0 rounded-full border-4 border-accent bg-transparent preserve-3d" style={{ transform: 'translateZ(-12px)' }} />
      </div>

      {/* Object 2: 3D Rotating Cube (Film Slate Box) - Mid Right */}
      <div 
        className="absolute top-[60vh] right-[5%] w-24 h-24 preserve-3d opacity-[0.06] hidden md:block"
        style={{ animation: 'float-2 28s ease-in-out infinite' }}
      >
        <div className="absolute inset-0 border-2 border-white/40 bg-white/[0.01] preserve-3d" style={{ transform: 'translateZ(48px)' }} />
        <div className="absolute inset-0 border-2 border-white/40 bg-white/[0.01] preserve-3d" style={{ transform: 'translateZ(-48px) rotateY(180deg)' }} />
        <div className="absolute inset-0 border-2 border-white/40 bg-white/[0.01] preserve-3d" style={{ transform: 'translateX(48px) rotateY(90deg)' }} />
        <div className="absolute inset-0 border-2 border-white/40 bg-white/[0.01] preserve-3d" style={{ transform: 'translateX(-48px) rotateY(-90deg)' }} />
        <div className="absolute inset-0 border-2 border-white/40 bg-white/[0.01] preserve-3d" style={{ transform: 'translateY(48px) rotateX(90deg)' }} />
        <div className="absolute inset-0 border-2 border-white/40 bg-white/[0.01] preserve-3d" style={{ transform: 'translateY(-48px) rotateX(-90deg)' }} />
      </div>

      {/* Object 3: Concentric Lens Ring - Bottom Left */}
      <div 
        className="absolute top-[110vh] left-[6%] w-36 h-36 preserve-3d opacity-[0.06] hidden lg:block"
        style={{ animation: 'float-3 30s ease-in-out infinite' }}
      >
        <div className="absolute inset-0 rounded-full border-[3px] border-accent/40 preserve-3d" style={{ transform: 'translateZ(0px)' }} />
        <div className="absolute inset-4 rounded-full border-2 border-white/20 preserve-3d" style={{ transform: 'translateZ(15px)' }} />
        <div className="absolute inset-8 rounded-full border-2 border-accent/30 preserve-3d" style={{ transform: 'translateZ(30px)' }} />
        <div className="absolute inset-12 rounded-full border border-white/10 preserve-3d" style={{ transform: 'translateZ(45px)' }} />
        <div className="absolute inset-4 rounded-full border-2 border-white/20 preserve-3d" style={{ transform: 'translateZ(-15px)' }} />
        <div className="absolute inset-8 rounded-full border-2 border-accent/30 preserve-3d" style={{ transform: 'translateZ(-30px)' }} />
      </div>

      {/* Object 4: Mini 3D Film Reel - Bottom Right */}
      <div 
        className="absolute top-[160vh] right-[6%] w-28 h-28 preserve-3d opacity-[0.06] hidden lg:block"
        style={{ animation: 'float-1 32s ease-in-out infinite', animationDelay: '-5s' }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-accent/40 bg-transparent preserve-3d" style={{ transform: 'translateZ(8px)' }} />
        <div className="absolute inset-0 rounded-full border-4 border-accent/40 bg-transparent preserve-3d" style={{ transform: 'translateZ(-8px)' }} />
        <div className="absolute w-[2px] h-full bg-accent/35 left-1/2 transform -translate-x-1/2" />
        <div className="absolute h-[2px] w-full bg-accent/35 top-1/2 transform -translate-y-1/2" />
      </div>
    </div>
  );
}

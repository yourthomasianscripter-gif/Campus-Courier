import React from 'react';

interface AmbientBackgroundProps {
  inner?: boolean;
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ inner = false }) => {
  return (
    <div 
      className={`${inner ? 'absolute' : 'fixed'} inset-0 pointer-events-none overflow-hidden select-none z-0`}
      aria-hidden="true"
    >
      {/* Base deep black layer */}
      <div className="absolute inset-0 bg-[#070708]" />

      {/* Floating Animated Orb 1 - Deep Dark Orange / Burnt Sienna */}
      <div 
        className="absolute -top-32 -left-32 w-[520px] h-[520px] sm:w-[700px] sm:h-[700px] rounded-full blur-[130px] sm:blur-[160px] animate-float-dark-orange pointer-events-none mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(154, 52, 18, 0.45) 0%, rgba(194, 65, 12, 0.28) 45%, transparent 75%)',
        }}
      />

      {/* Floating Animated Orb 2 - Luminous Light Orange / Tangerine */}
      <div 
        className="absolute top-1/4 -right-28 w-[450px] h-[450px] sm:w-[620px] sm:h-[620px] rounded-full blur-[140px] sm:blur-[170px] animate-float-light-orange pointer-events-none mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(251, 146, 60, 0.35) 0%, rgba(249, 115, 22, 0.22) 40%, rgba(194, 65, 12, 0.1) 65%, transparent 80%)',
        }}
      />

      {/* Floating Animated Orb 3 - Warm Amber / Dark Orange Hearth at bottom */}
      <div 
        className="absolute -bottom-40 left-1/3 w-[550px] h-[550px] sm:w-[750px] sm:h-[750px] rounded-full blur-[150px] sm:blur-[180px] animate-float-amber-aura pointer-events-none mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(124, 45, 18, 0.4) 0%, rgba(234, 88, 12, 0.25) 40%, rgba(253, 186, 116, 0.15) 60%, transparent 80%)',
        }}
      />

      {/* Sweeping dynamic multi-stop gradient mesh mixing dark orange, light orange, and deep black with low opacity */}
      <div 
        className="absolute inset-0 opacity-20 sm:opacity-25 mix-blend-screen animate-orange-mesh pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(at 15% 20%, rgba(194, 65, 12, 0.32) 0px, transparent 55%),
            radial-gradient(at 85% 25%, rgba(251, 146, 60, 0.28) 0px, transparent 50%),
            radial-gradient(at 40% 75%, rgba(154, 52, 18, 0.35) 0px, transparent 60%),
            radial-gradient(at 75% 85%, rgba(253, 186, 116, 0.2) 0px, transparent 55%)
          `,
        }}
      />

      {/* Diagonal shifting atmospheric wave */}
      <div 
        className="absolute inset-0 opacity-15 mix-blend-color-dodge pointer-events-none animate-orange-mesh"
        style={{
          backgroundImage: 'linear-gradient(125deg, rgba(124, 45, 18, 0.25) 0%, rgba(7, 7, 8, 0.95) 30%, rgba(249, 115, 22, 0.2) 60%, rgba(7, 7, 8, 0.95) 80%, rgba(253, 186, 116, 0.18) 100%)',
        }}
      />

      {/* Central clarity vignette: guarantees high contrast and crystal-clear text readability across broadsheet */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070708]/60 via-transparent to-[#070708]/80 pointer-events-none" />
    </div>
  );
};

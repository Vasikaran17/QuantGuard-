import React from 'react';

export const CyberBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Subtle top ambient lighting */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] opacity-40 blur-3xl"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(37, 99, 235, 0.12) 0%, rgba(14, 165, 233, 0.04) 40%, transparent 70%)'
        }}
      />

      {/* Engineering precision grid */}
      <div 
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #94A3B8 1px, transparent 1px),
            linear-gradient(to bottom, #94A3B8 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Subtle radial falloff to keep focus on foreground data */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 30%, transparent 20%, rgba(10, 14, 23, 0.7) 100%)'
        }}
      />
    </div>
  );
};

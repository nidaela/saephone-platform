import React from "react";
import Link from "next/link";

interface HomeLogoHeaderProps {
  onNavigateToDashboard?: () => void;
  title?: string;
  subtitle?: string;
  ariaLabel?: string;
}

export const HomeLogoHeader: React.FC<HomeLogoHeaderProps> = ({ 
  onNavigateToDashboard, 
  title = "SAEPHONE", 
  subtitle = "PLATAFORMA DE VENTAS", 
  ariaLabel = "Ir al inicio" 
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateToDashboard) {
      onNavigateToDashboard();
    }
  };

  return (
    <a 
      href="#" 
      onClick={handleClick}
      aria-label={ariaLabel}
      className="flex items-center gap-4 bg-[#4A5AA0] hover:opacity-90 hover:shadow-lg transition-all rounded-2xl px-5 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 shadow-md cursor-pointer"
      style={{ minWidth: 280 }}
    >
      <div className="bg-white rounded-xl p-2 flex items-center justify-center shadow">
        <img
          src="/saephone-logo.jpg"
          alt="SAEPHONE Logo"
          className="w-14 h-14 object-contain"
        />
      </div>
      <div className="flex flex-col items-start justify-center text-left">
        <span className="text-white text-2xl font-extrabold leading-tight font-sans">{title}</span>
        <span className="text-white text-base font-medium font-sans tracking-wide mt-1">{subtitle}</span>
      </div>
    </a>
  );
}; 
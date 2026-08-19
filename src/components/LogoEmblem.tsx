import React, { useState } from "react";

interface LogoEmblemProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  showRegistrationBadge?: boolean;
  className?: string;
}

export const LogoEmblem: React.FC<LogoEmblemProps> = ({
  size = "md",
  showRegistrationBadge = true,
  className = "",
}) => {
  const [imgSrc, setImgSrc] = useState<string>("/Logo.png");

  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20",
    xl: "w-28 h-28",
    "2xl": "w-44 h-44 sm:w-52 sm:h-52",
  };

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Outer Circular Seal Badge with Logo Picture */}
      <div
        className={`relative rounded-full shadow-2xl overflow-hidden bg-black p-0 shrink-0 border border-amber-500/40 hover:border-amber-400 transition-all ${sizeClasses[size]}`}
      >
        <img
          src={imgSrc}
          alt="Maratha Welfare Association Kollam Official Logo"
          className="w-full h-full object-cover object-center rounded-full"
          referrerPolicy="no-referrer"
          loading="eager"
          onError={() => {
            if (imgSrc !== "/logo.png") {
              setImgSrc("/logo.png");
            }
          }}
        />
      </div>

      {showRegistrationBadge && size !== "sm" && (
        <span className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-amber-200 bg-stone-900/90 px-3 py-0.5 rounded-full border border-amber-500/40 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Regd.No. KLM/TC/101/2024</span>
        </span>
      )}
    </div>
  );
};



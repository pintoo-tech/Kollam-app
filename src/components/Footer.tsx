import React from "react";
import { LogoEmblem } from "./LogoEmblem";

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenRegisterModal: () => void;
  onOpenIdCardModal: () => void;
  onOpenAdminPanel?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveTab,
  onOpenIdCardModal,
  onOpenAdminPanel,
}) => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-amber-600/30 mt-4 pt-4 pb-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        {/* Branding */}
        <div
          onClick={() => setActiveTab("home")}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <LogoEmblem size="sm" showRegistrationBadge={false} />
          <span className="font-bold text-amber-100 text-xs sm:text-sm">
            Kollam District Maratha Welfare Association
          </span>
        </div>

        {/* Developer / Creator Attribution - Clean without box or border */}
        <div className="text-center">
          <span className="text-xs sm:text-sm text-amber-300 font-medium tracking-wide">
            𝓪𝓹𝓹 𝓫𝔂, ꜱᴜᴅʜɪʀ ꜱᴀɪᴛ, ᴘᴜᴛʜᴜʀ.
          </span>
        </div>

        {/* Copyright */}
        <p className="text-[11px] sm:text-xs text-stone-500 md:text-right">
          © {new Date().getFullYear()} Kollam District Maratha Welfare Association • All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};


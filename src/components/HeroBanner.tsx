import React from "react";
import { LogoEmblem } from "./LogoEmblem";
import {
  Users,
  Building2,
  CreditCard,
  UserPlus,
  MapPin,
  Sparkles,
  Award,
} from "lucide-react";
import { KOLLAM_ASSOCIATION_INFO } from "../data/kollamData";

interface HeroBannerProps {
  setActiveTab: (tab: string) => void;
  onOpenRegisterModal: () => void;
  onOpenIdCardModal: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  setActiveTab,
  onOpenRegisterModal,
  onOpenIdCardModal,
}) => {
  return (
    <div className="relative bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 text-stone-100 py-12 px-4 sm:px-6 rounded-2xl shadow-2xl border border-amber-600/30 overflow-hidden mb-8">
      {/* Background Decorative Graphic */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left Text Content */}
        <div className="flex-1 text-center lg:text-left space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Kollam Member Portal</span>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <button
              onClick={onOpenRegisterModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm shadow-lg hover:shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <UserPlus className="w-4 h-4 text-stone-950" />
              <span>New Membership Registration</span>
            </button>

            <button
              onClick={onOpenIdCardModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 font-bold text-sm border border-amber-600/40 shadow-md transition-all"
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Get Digital ID Card</span>
            </button>

            <button
              onClick={() => setActiveTab("ai-assistant")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-300 font-bold text-sm border border-amber-500/40 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Ask AI Helper</span>
            </button>
          </div>
        </div>

        {/* Right Seal & Quick Badge */}
        <div className="flex flex-col items-center justify-center bg-stone-950/80 p-6 rounded-2xl border border-amber-500/30 shadow-xl min-w-[280px]">
          <LogoEmblem size="2xl" showRegistrationBadge={false} />
          
          <div className="mt-4 w-full pt-3 border-t border-amber-500/20 text-center space-y-1">
            <span className="text-xs font-bold text-stone-300 block">
              District Headquarters
            </span>
            <p className="text-[11px] text-amber-200/80 flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" />
              <span>Anandavalleswaram, Kollam - 691001</span>
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-amber-500/20 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div
          onClick={() => setActiveTab("members")}
          className="p-3 rounded-xl bg-stone-950/50 border border-amber-900/30 hover:border-amber-500/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xl font-black">
            <Users className="w-5 h-5 text-amber-400" />
            <span>{KOLLAM_ASSOCIATION_INFO.totalMembersCount}+</span>
          </div>
          <span className="text-xs text-stone-300 font-medium mt-0.5 block">
            Kollam Members
          </span>
        </div>

        <div
          onClick={() => setActiveTab("taluks")}
          className="p-3 rounded-xl bg-stone-950/50 border border-amber-900/30 hover:border-amber-500/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xl font-black">
            <Building2 className="w-5 h-5 text-amber-400" />
            <span>7 Taluks</span>
          </div>
          <span className="text-xs text-stone-300 font-medium mt-0.5 block">
            Active Regional Units
          </span>
        </div>

        <div
          onClick={() => setActiveTab("committee")}
          className="p-3 rounded-xl bg-stone-950/50 border border-amber-900/30 hover:border-amber-500/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xl font-black">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Executive Board</span>
          </div>
          <span className="text-xs text-stone-300 font-medium mt-0.5 block">
            Office Bearers
          </span>
        </div>

        <div
          onClick={() => setActiveTab("events")}
          className="p-3 rounded-xl bg-stone-950/50 border border-amber-900/30 hover:border-amber-500/50 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xl font-black">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Events & Gallery</span>
          </div>
          <span className="text-xs text-stone-300 font-medium mt-0.5 block">
            District Activities
          </span>
        </div>
      </div>
    </div>
  );
};

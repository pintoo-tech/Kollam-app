import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GoldRates, GoldRatePromo, CurrentUser } from "../types";
import { Coins, TrendingUp, Sparkles, Edit3 } from "lucide-react";

interface GoldRatesViewProps {
  goldRates: GoldRates;
  goldPromos?: GoldRatePromo[];
  onOpenAdminPanel?: () => void;
  currentUser?: CurrentUser;
}

export const GoldRatesView: React.FC<GoldRatesViewProps> = ({
  goldRates,
  goldPromos = [],
  onOpenAdminPanel,
  currentUser,
}) => {
  // 4x6 Slideshow State (2 images with diffusion effect every 7 seconds)
  const promoSlides =
    goldPromos && goldPromos.length > 0
      ? goldPromos.slice(0, 2)
      : [
          {
            id: "gold-promo-1",
            imageUrl:
              "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
            title: "Kollam Royal Heritage Jewellery",
            subtitle: "Exclusive 916 Hallmark Jewellery & Bullion Bar Collections",
          },
          {
            id: "gold-promo-2",
            imageUrl:
              "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
            title: "Pure Gold & Sovereign Showcase",
            subtitle: "Certified 22ct / 916 & 24ct Fine Gold at Best Daily Rates",
          },
        ];

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Auto transition 2 images slideshow with diffusion effect in 7 seconds interval
  useEffect(() => {
    if (promoSlides.length <= 1) return;

    const interval = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % promoSlides.length);
    }, 7000); // 7 seconds interval

    return () => clearInterval(interval);
  }, [promoSlides.length]);

  const currentSlide = promoSlides[activeSlideIndex] || promoSlides[0];

  return (
    <div className="space-y-6 max-w-xl mx-auto py-2">
      {/* Header Caption: "Today's Gold Rates" with blinking green dot */}
      <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
          </span>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-amber-100 tracking-tight flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-400" />
              <span>Today's Gold Rates</span>
            </h2>
            <p className="text-[11px] text-stone-400 font-medium">
              Live Kerala Bullion Benchmark • 22ct &amp; 24ct 999
            </p>
          </div>
        </div>

        {/* Admin Quick Action if Logged in as Admin */}
        {currentUser?.role === "admin" && onOpenAdminPanel && (
          <button
            type="button"
            onClick={onOpenAdminPanel}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow flex items-center gap-1.5 transition-all"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Rates &amp; Pictures</span>
          </button>
        )}
      </div>

      {/* 2x2 Compact Sleek Gold Rate Board */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {/* Card 1: 22ct / 916 /gm */}
        <div className="bg-[#181614] rounded-xl p-2.5 sm:py-2.5 sm:px-3.5 border border-amber-600/40 hover:border-amber-500/70 transition-all shadow-md flex flex-col justify-center">
          <div className="flex items-center">
            <span className="px-2.5 py-0.5 rounded-full bg-[#351e08]/90 text-amber-400 font-bold text-[11px] sm:text-xs border border-amber-600/60 inline-flex items-center gap-1">
              <span>22ct / 916</span>
              <span className="text-amber-200/90 font-medium">/gm</span>
            </span>
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-black text-[#fef9c3] tracking-tight mt-1 font-sans">
            {goldRates.rate22_1g ? (goldRates.rate22_1g.startsWith("₹") ? goldRates.rate22_1g : `₹${goldRates.rate22_1g}`) : "₹14150"}
          </div>
        </div>

        {/* Card 2: 1 Pavan (8g) */}
        <div className="bg-[#181614] rounded-xl p-2.5 sm:py-2.5 sm:px-3.5 border border-amber-600/40 hover:border-amber-500/70 transition-all shadow-md flex flex-col justify-center">
          <div className="flex items-center">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 font-black text-[11px] sm:text-xs shadow-sm">
              1 Pavan (8g)
            </span>
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-black text-[#fef9c3] tracking-tight mt-1 font-sans">
            {goldRates.rate22_8g ? (goldRates.rate22_8g.startsWith("₹") ? goldRates.rate22_8g : `₹${goldRates.rate22_8g}`) : "₹1,13,200"}
          </div>
        </div>

        {/* Card 3: Fine 999 /gm */}
        <div className="bg-[#181614] rounded-xl p-2.5 sm:py-2.5 sm:px-3.5 border border-amber-600/40 hover:border-amber-500/70 transition-all shadow-md flex flex-col justify-center">
          <div className="flex items-center">
            <span className="px-2.5 py-0.5 rounded-full bg-[#351e08]/90 text-amber-400 font-bold text-[11px] sm:text-xs border border-amber-600/60 inline-flex items-center gap-1">
              <span>Fine 999</span>
              <span className="text-amber-200/90 font-medium">/gm</span>
            </span>
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-black text-[#fef9c3] tracking-tight mt-1 font-sans">
            {goldRates.rate999_1g ? (goldRates.rate999_1g.startsWith("₹") ? goldRates.rate999_1g : `₹${goldRates.rate999_1g}`) : "₹14710"}
          </div>
        </div>

        {/* Card 4: Silver /gm */}
        <div className="bg-[#181614] rounded-xl p-2.5 sm:py-2.5 sm:px-3.5 border border-amber-600/40 hover:border-amber-500/70 transition-all shadow-md flex flex-col justify-center">
          <div className="flex items-center">
            <span className="px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-200 font-bold text-[11px] sm:text-xs border border-stone-700 inline-flex items-center gap-1">
              <span>Silver</span>
              <span className="text-stone-300 font-medium">/gm</span>
            </span>
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-black text-[#fef9c3] tracking-tight mt-1 font-sans">
            {goldRates.silver999_1g ? (goldRates.silver999_1g.startsWith("₹") ? goldRates.silver999_1g : `₹${goldRates.silver999_1g}`) : "₹250"}
          </div>
        </div>
      </div>

      {/* 4x6 PICTURE SLIDESHOW UNDER GOLD RATES WITH DIFFUSION EFFECT (7 SECONDS INTERVAL) */}
      <div className="pt-2">
        {/* 4x6 Ratio Box (aspect-[4/6]) with Clean Diffusion (Fade/Dissolve) Effect - Full Clear Picture */}
        <div className="relative w-full max-w-[340px] sm:max-w-[380px] mx-auto aspect-[4/6] rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/40 bg-stone-950 group">
          {/* Slides with smooth diffusion effect */}
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={currentSlide.id || `promo-slide-${activeSlideIndex}`}
              initial={{ opacity: 0, filter: "blur(6px) brightness(0.9)" }}
              animate={{ opacity: 1, filter: "blur(0px) brightness(1)" }}
              exit={{ opacity: 0, filter: "blur(6px) brightness(0.9)" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="w-full h-full absolute inset-0"
            >
              <img
                src={currentSlide.imageUrl}
                alt="Gold & Jewellery Showcase"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>

          {/* Bottom Dot Indicators */}
          {promoSlides.length > 1 && (
            <div className="absolute bottom-2.5 right-3 z-20 flex items-center gap-1.5 px-2 py-1 rounded-full bg-stone-950/80 backdrop-blur-md border border-stone-800">
              {promoSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeSlideIndex
                      ? "w-4 bg-amber-400 shadow-sm shadow-amber-400"
                      : "w-1.5 bg-stone-600 hover:bg-stone-400"
                  }`}
                  title={`View Picture ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

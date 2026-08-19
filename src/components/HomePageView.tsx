import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LogoEmblem } from "./LogoEmblem";
import { AppNotification, AdvertisementSlide, GoldRates } from "../types";
import {
  Bell,
  Info,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ArrowRight,
  Cake,
  PartyPopper,
} from "lucide-react";

interface HomePageViewProps {
  notifications: AppNotification[];
  advertisements: AdvertisementSlide[];
  goldRates: GoldRates;
  onOpenAdminPanel: () => void;
  setActiveTab: (tab: string) => void;
}

export const HomePageView: React.FC<HomePageViewProps> = ({
  notifications,
  advertisements,
  goldRates,
  setActiveTab,
}) => {
  // Advertisement slideshow state (7 seconds interval)
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [adFade, setAdFade] = useState(true);

  // Active notifications filter (strictly 2 pictures slideshow as requested) & 7-second slideshow state with slide to left effect
  const activeNotifications = notifications.filter((n) => n.active !== false).slice(0, 2);
  const [activeNotifIndex, setActiveNotifIndex] = useState(0);

  // Live Gold Rates Slideshow state with 2-second interval & fading effect
  const [goldRateSlideIndex, setGoldRateSlideIndex] = useState(0);
  const [goldRateFade, setGoldRateFade] = useState(true);

  // Slideshow items as requested:
  // 1. 22ct/916: (blank)/gm
  // 2. 22ct/916: (blank)/8gm
  // 3. Fine 999: (blank)/gm
  // 4. Silver 999: (blank)/gm
  const goldRateSlides = [
    {
      label: "22ct / 916",
      value: `₹${goldRates.rate22_1g || "6,740"} / gm`,
      unit: "Per 1 Gram",
      color: "text-amber-300",
    },
    {
      label: "22ct / 916",
      value: `₹${goldRates.rate22_8g || "53,920"} / 8gm`,
      unit: "Per 8 Grams (1 Pavan)",
      color: "text-amber-400",
    },
    {
      label: "Fine 999",
      value: `₹${goldRates.rate999_1g || "7,350"} / gm`,
      unit: "Per 1 Gram (24ct)",
      color: "text-amber-200",
    },
    {
      label: "Silver 999",
      value: `₹${goldRates.silver999_1g || "98.50"} / gm`,
      unit: "Per 1 Gram Silver",
      color: "text-stone-200",
    },
  ];

  // Auto transition live gold rates slideshow every 2 seconds with fade effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGoldRateFade(false); // start fade out
      setTimeout(() => {
        setGoldRateSlideIndex((prev) => (prev + 1) % goldRateSlides.length);
        setGoldRateFade(true); // start fade in
      }, 300); // 300ms transition time
    }, 2000); // 2 seconds interval

    return () => clearInterval(interval);
  }, [goldRateSlides.length]);

  // Auto transition notifications every 7 seconds with slide to left effect
  useEffect(() => {
    if (!activeNotifications || activeNotifications.length <= 1) return;

    const interval = setInterval(() => {
      setActiveNotifIndex((prev) => (prev + 1) % activeNotifications.length);
    }, 7000); // 7 seconds interval

    return () => clearInterval(interval);
  }, [activeNotifications.length]);

  // Auto transition advertisement every 7 seconds with fade effect
  useEffect(() => {
    if (!advertisements || advertisements.length <= 1) return;

    const interval = setInterval(() => {
      setAdFade(false); // start fade out
      setTimeout(() => {
        setCurrentAdIndex((prev) => (prev + 1) % advertisements.length);
        setAdFade(true); // start fade in
      }, 500); // 500ms fade transition
    }, 7000); // 7 seconds interval

    return () => clearInterval(interval);
  }, [advertisements.length]);

  const currentAd = advertisements[currentAdIndex] || advertisements[0];
  const currentNotif = activeNotifications[activeNotifIndex] || activeNotifications[0];
  const currentGoldSlide = goldRateSlides[goldRateSlideIndex] || goldRateSlides[0];

  return (
    <div className="space-y-4 max-w-5xl mx-auto -mt-2">
      {/* TOP CENTER: Association Logo & Name (Tight upward spacing) */}
      <div className="text-center space-y-1.5 pt-0 pb-1">
        {/* Association Logo at Top Center */}
        <div className="flex justify-center items-center">
          <LogoEmblem size="lg" showRegistrationBadge={false} />
        </div>

        {/* Association Name in Bold and Beautiful Fonts */}
        <div className="space-y-0.5">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 uppercase font-serif drop-shadow-sm leading-tight px-2">
            KOLLAM DISTRICT MARATHA WELFARE ASSOCIATION
          </h1>
        </div>

        {/* SMALL BOX UNDER ASSOCIATION NAME: LIVE GOLD RATES FADING SLIDESHOW (2 SECONDS INTERVAL, SINGLE COMPACT LINE) */}
        <div className="pt-0.5 flex justify-center px-2">
          <div
            onClick={() => setActiveTab("gold-rates")}
            className="cursor-pointer group inline-flex items-center justify-center gap-2.5 sm:gap-3 py-1 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-stone-950 via-amber-950/70 to-stone-950 border border-amber-500/50 hover:border-amber-400 shadow-md shadow-amber-950/30 transition-all hover:scale-[1.01] max-w-md w-full sm:w-auto"
            title="Click to view full Live Gold Rates & Calculator page"
          >
            {/* Heading: Live Rates with Blinking Green Dot on Left */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                Live Rates
              </span>
              <span className="text-stone-600 font-bold ml-0.5">|</span>
            </div>

            {/* Slideshow Content on the right of Live Rates */}
            <div className="flex items-center justify-start min-w-[170px] sm:min-w-[190px] h-5 overflow-hidden">
              <div
                className={`flex items-center gap-1.5 text-xs transition-all duration-300 ${
                  goldRateFade
                    ? "opacity-100 transform translate-y-0"
                    : "opacity-0 transform -translate-y-0.5"
                }`}
              >
                <span className="font-bold text-stone-300 whitespace-nowrap">
                  {currentGoldSlide.label}:
                </span>
                <span
                  className={`font-black font-mono text-xs sm:text-sm ${currentGoldSlide.color} drop-shadow-sm whitespace-nowrap`}
                >
                  {currentGoldSlide.value}
                </span>
              </div>
            </div>

            {/* View Page indicator */}
            <div className="hidden sm:flex items-center text-[10px] text-amber-400/80 group-hover:text-amber-300 font-bold shrink-0">
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 1. NOTIFICATION SECTION - NO TABS OR TAB EVENTS */}
      <div className="space-y-1.5">
        {/* Section Header: Pure Notification Label with Icon (No tab buttons) */}
        <div className="flex items-center gap-2 px-1">
          <Bell className="w-4 h-4 text-amber-400 animate-bounce" />
          <h2 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            Notification
          </h2>
        </div>

        {/* Text Caption Directly Above the Picture Box - Fixed size of 1 line title and 2 lines subtitle */}
        {currentNotif ? (
          <div
            id="notification-caption-box"
            key={currentNotif.id || activeNotifIndex}
            className="bg-stone-900/95 border border-amber-500/30 rounded-xl px-3.5 py-2.5 shadow-md h-[88px] min-h-[88px] max-h-[88px] flex flex-col justify-center overflow-hidden transition-all duration-300"
          >
            <div className="flex items-center justify-between gap-2 shrink-0">
              <h3 id="notification-title" className="text-xs sm:text-sm font-bold text-amber-100 line-clamp-1 leading-tight truncate flex-1">
                {currentNotif.title}
              </h3>
              {currentNotif.date && (
                <span className="text-[10px] sm:text-[11px] text-amber-400/90 font-mono font-semibold shrink-0 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  <span>{currentNotif.date}</span>
                </span>
              )}
            </div>

            <p id="notification-subtitle" className="text-[11px] sm:text-xs text-stone-200 leading-relaxed font-normal line-clamp-2 mt-1 h-[2.8em] overflow-hidden">
              {currentNotif.message || ""}
            </p>
          </div>
        ) : (
          <div id="notification-empty-box" className="bg-stone-900/95 border border-stone-800 rounded-xl px-3.5 py-2.5 shadow-md h-[88px] min-h-[88px] max-h-[88px] flex items-center justify-center text-stone-500 text-xs">
            No active notifications at present.
          </div>
        )}

        {/* Notification Picture Box with SLIDE TO LEFT Effect */}
        <div className="h-[25vh] min-h-[190px] bg-stone-900 border border-amber-600/40 rounded-2xl overflow-hidden shadow-xl relative group">
          <AnimatePresence initial={false} mode="popLayout">
            {currentNotif?.imageUrl ? (
              <motion.div
                key={currentNotif.id || `notif-img-${activeNotifIndex}`}
                initial={{ x: "100%", opacity: 0.85 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0.85 }}
                transition={{ duration: 0.65, ease: [0.32, 0.72, 0, 1] }}
                className="w-full h-full absolute inset-0"
              >
                <img
                  src={currentNotif.imageUrl}
                  alt={currentNotif.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ) : (
              <motion.div
                key="empty-notif"
                initial={{ x: "100%", opacity: 0.85 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0.85 }}
                transition={{ duration: 0.65, ease: [0.32, 0.72, 0, 1] }}
                className="w-full h-full absolute inset-0 bg-gradient-to-br from-stone-900 via-amber-950/40 to-stone-900 flex flex-col items-center justify-center p-6 text-center space-y-2"
              >
                <LogoEmblem size="lg" showRegistrationBadge={false} />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-300">
                    Official Notice Board
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Kollam District Maratha Welfare Association
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Indicator dots for notifications */}
          {activeNotifications.length > 1 && (
            <div className="absolute bottom-2.5 right-3 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-stone-950/75 backdrop-blur-sm border border-stone-800/80 shadow-md">
              {activeNotifications.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveNotifIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === activeNotifIndex
                      ? "w-4 bg-amber-400"
                      : "w-1.5 bg-stone-600 hover:bg-stone-400"
                  }`}
                  title={`View notification ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. ADVERTISEMENT SECTION */}
      <div className="space-y-1.5">
        {/* Section Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Advertisements
            </h2>
          </div>
        </div>

        {/* Text Caption Directly Above the Picture Box - Fixed size of 1 title and 2 lines for subtitles */}
        {currentAd ? (
          <div
            className={`bg-stone-900/95 border border-stone-800 rounded-xl p-3 shadow-md h-[86px] sm:h-[92px] min-h-[86px] sm:min-h-[92px] max-h-[86px] sm:max-h-[92px] flex flex-col justify-center overflow-hidden transition-opacity duration-500 ${
              adFade ? "opacity-100" : "opacity-0"
            }`}
          >
            <h3 className="text-xs sm:text-sm font-bold text-amber-100 line-clamp-1 leading-snug shrink-0">
              {currentAd.title}
            </h3>
            <p className="text-[11px] sm:text-xs text-stone-200 leading-snug font-normal line-clamp-2 mt-1 min-h-[2.75em]">
              {currentAd.subtitle || ""}
            </p>
          </div>
        ) : (
          <div className="bg-stone-900/95 border border-stone-800 rounded-xl p-3 shadow-md h-[86px] sm:h-[92px] min-h-[86px] sm:min-h-[92px] max-h-[86px] sm:max-h-[92px] flex items-center justify-center text-stone-500 text-xs">
            No active advertisement available.
          </div>
        )}

        {/* Advertisement Picture Box (Clickable link without any overlay button/tab) */}
        <div
          onClick={() => {
            if (currentAd?.linkUrl) {
              window.open(currentAd.linkUrl, "_blank", "noopener,noreferrer");
            }
          }}
          className={`h-[20vh] min-h-[160px] sm:min-h-[180px] rounded-2xl border border-amber-600/30 relative overflow-hidden bg-stone-900 shadow-xl group ${
            currentAd?.linkUrl ? "cursor-pointer" : ""
          }`}
          title={currentAd?.linkUrl ? `Click to open link: ${currentAd.linkUrl}` : undefined}
        >
          {currentAd ? (
            <div
              className={`w-full h-full relative transition-opacity duration-500 ${
                adFade ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={currentAd.imageUrl}
                alt={currentAd.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-stone-500 text-xs">
              No advertisement available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { AssociationEvent, GalleryItem, Member } from "../types";
import { Calendar, MapPin, Clock, Image, Award, Sparkles, CheckCircle2, Cake } from "lucide-react";
import { BirthdayView } from "./BirthdayView";

interface EventsAnnouncementsViewProps {
  events: AssociationEvent[];
  gallery: GalleryItem[];
  members?: Member[];
  onOpenBirthdayView?: () => void;
}

export const EventsAnnouncementsView: React.FC<EventsAnnouncementsViewProps> = ({
  events,
  gallery,
  members = [],
  onOpenBirthdayView,
}) => {
  const [activeTab, setActiveTab] = useState<"events" | "gallery" | "birthdays">("events");

  return (
    <div className="space-y-6">
      {/* Tab Selector Header */}
      <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-amber-100 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-500" />
            <span>Kollam Association Events & Media Gallery</span>
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Shivaji Jayanti rallies, general body meetings, birthdays, and community gatherings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-stone-950 p-1 rounded-xl border border-stone-800">
          <button
            onClick={() => setActiveTab("events")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "events"
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "text-stone-300 hover:text-amber-300"
            }`}
          >
            Events ({events.length})
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "gallery"
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "text-stone-300 hover:text-amber-300"
            }`}
          >
            Photo Archive ({gallery.length})
          </button>
          <button
            onClick={() => {
              if (onOpenBirthdayView) {
                onOpenBirthdayView();
              } else {
                setActiveTab("birthdays");
              }
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "birthdays"
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "text-amber-400 hover:text-amber-300 bg-amber-950/40 border border-amber-500/30"
            }`}
          >
            <Cake className="w-3.5 h-3.5 text-amber-400" />
            <span>Birthdays</span>
          </button>
        </div>
      </div>

      {activeTab === "birthdays" && members.length > 0 && (
        <BirthdayView members={members} />
      )}

      {activeTab === "events" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 hover:border-amber-500/50 transition-all shadow-md flex flex-col justify-between"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={evt.imageUrl}
                  alt={evt.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg backdrop-blur-md ${
                      evt.status === "Upcoming"
                        ? "bg-emerald-950/90 text-emerald-300 border border-emerald-500/40"
                        : "bg-stone-900/90 text-stone-300 border border-stone-700"
                    }`}
                  >
                    {evt.status}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-bold text-base text-amber-100 leading-snug">
                    {evt.title}
                  </h3>

                  <div className="space-y-1 text-xs text-stone-300 bg-stone-950/70 p-3 rounded-xl border border-stone-800/80">
                    <div className="flex items-center gap-2 text-amber-300 font-bold">
                      <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{evt.date} • {evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-300">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{evt.venue}</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed pt-1">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-[11px] text-amber-400 font-bold">
                  <span>Organized by: {evt.talukUnit} Unit</span>
                  <span>Regd. KLM/TC/101/2024</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "gallery" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {gallery.map((g) => (
            <div
              key={g.id}
              className="bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 hover:border-amber-500/50 transition-all shadow-md group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={g.imageUrl}
                  alt={g.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[10px] text-amber-400 font-mono font-bold block">
                  {g.date}
                </span>
                <h4 className="font-bold text-stone-100 text-sm">{g.title}</h4>
                <p className="text-xs text-stone-400 leading-normal">{g.caption}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

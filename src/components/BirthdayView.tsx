import React, { useState, useMemo } from "react";
import { Member } from "../types";
import {
  Cake,
  Calendar,
  Sparkles,
  Search,
  Phone,
  MessageCircle,
  MapPin,
  PartyPopper,
  Gift,
  Heart,
  UserCheck,
} from "lucide-react";

interface BirthdayViewProps {
  members: Member[];
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Helper to parse DOB string and extract month and day
function parseDob(dobStr?: string): { month: number; day: number; year?: number; raw: string } | null {
  if (!dobStr) return null;
  const cleaned = dobStr.trim();
  const parts = cleaned.split(/[-/.]/);

  if (parts.length === 3) {
    // YYYY-MM-DD or DD-MM-YYYY
    if (parts[0].length === 4) {
      // YYYY-MM-DD
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      if (!isNaN(month) && !isNaN(day)) return { month, day, year, raw: cleaned };
    } else {
      // DD-MM-YYYY
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (!isNaN(month) && !isNaN(day)) return { month, day, year, raw: cleaned };
    }
  } else if (parts.length === 2) {
    // MM-DD
    const month = parseInt(parts[0], 10);
    const day = parseInt(parts[1], 10);
    if (!isNaN(month) && !isNaN(day)) return { month, day, raw: cleaned };
  }
  return null;
}

export const BirthdayView: React.FC<BirthdayViewProps> = ({ members }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<number | "ALL">(new Date().getMonth() + 1);

  const today = useMemo(() => new Date(), []);
  const currentMonth = today.getMonth() + 1; // 1-12
  const currentDay = today.getDate(); // 1-31

  // Filter approved members with valid DOB
  const parsedMembers = useMemo(() => {
    return members
      .filter((m) => m.status !== "Pending Approval")
      .map((m) => {
        const parsed = parseDob(m.dob);
        let age: number | undefined;
        let isToday = false;
        let isThisMonth = false;

        if (parsed) {
          isToday = parsed.month === currentMonth && parsed.day === currentDay;
          isThisMonth = parsed.month === currentMonth;
          if (parsed.year) {
            age = today.getFullYear() - parsed.year;
            if (
              today.getMonth() + 1 < parsed.month ||
              (today.getMonth() + 1 === parsed.month && today.getDate() < parsed.day)
            ) {
              age -= 1;
            }
          }
        }

        return {
          member: m,
          dobParsed: parsed,
          isToday,
          isThisMonth,
          age,
        };
      });
  }, [members, currentMonth, currentDay, today]);

  // Today's Birthdays
  const todayBirthdays = useMemo(() => {
    return parsedMembers.filter((item) => item.isToday);
  }, [parsedMembers]);

  // This Month's Upcoming Birthdays
  const thisMonthBirthdays = useMemo(() => {
    return parsedMembers
      .filter((item) => item.dobParsed && item.dobParsed.month === currentMonth && !item.isToday)
      .sort((a, b) => (a.dobParsed?.day || 0) - (b.dobParsed?.day || 0));
  }, [parsedMembers, currentMonth]);

  // Filtered List based on selected month tab & search query
  const filteredMembers = useMemo(() => {
    return parsedMembers
      .filter((item) => {
        if (!item.dobParsed) return false;
        if (selectedMonth !== "ALL" && item.dobParsed.month !== selectedMonth) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const nameMatch = item.member.name.toLowerCase().includes(q);
          const placeMatch =
            (item.member.place || "").toLowerCase().includes(q) ||
            (item.member.talukUnit || "").toLowerCase().includes(q);
          const phoneMatch = item.member.phone.includes(q);
          return nameMatch || placeMatch || phoneMatch;
        }
        return true;
      })
      .sort((a, b) => {
        if (selectedMonth === "ALL") {
          // sort by month then day
          if (a.dobParsed!.month !== b.dobParsed!.month) {
            return a.dobParsed!.month - b.dobParsed!.month;
          }
          return a.dobParsed!.day - b.dobParsed!.day;
        }
        return a.dobParsed!.day - b.dobParsed!.day;
      });
  }, [parsedMembers, selectedMonth, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 p-4 sm:p-5 rounded-2xl border border-amber-500/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500 text-stone-950 rounded-2xl shadow-md">
            <Cake className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-amber-100 flex items-center gap-2">
              <span>Member Birthday Automation</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-amber-300/90 font-medium">
              Today: <strong>{today.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</strong> • Automatic detection of approved members
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-stone-950/80 px-3.5 py-1.5 rounded-xl border border-amber-500/30 text-xs text-amber-300 font-bold">
          <PartyPopper className="w-4 h-4 text-amber-400" />
          <span>{todayBirthdays.length} Birthday{todayBirthdays.length !== 1 ? "s" : ""} Today</span>
        </div>
      </div>

      {/* HIGHLIGHTED SECTION: TODAY'S BIRTHDAYS (If any) */}
      {todayBirthdays.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-black text-sm uppercase tracking-wider">
            <PartyPopper className="w-5 h-5 text-amber-400 animate-bounce" />
            <span>🎉 Today's Birthday Celebration ({todayBirthdays.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todayBirthdays.map(({ member, age, dobParsed }) => (
              <div
                key={member.id}
                className="bg-gradient-to-br from-amber-900/90 via-stone-900 to-stone-950 rounded-2xl p-4 sm:p-5 border-2 border-amber-400 shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 font-black text-[10px] uppercase shadow-sm flex items-center gap-1">
                  <Cake className="w-3 h-3" />
                  <span>Today's Birthday!</span>
                </div>

                <div className="flex items-start gap-3.5">
                  <img
                    src={
                      member.avatarUrl ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
                    }
                    alt={member.name}
                    className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl object-cover border-2 border-amber-400 shadow-md bg-stone-800 shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 space-y-1 text-xs">
                    <span className="font-mono text-[10px] font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded border border-amber-500/40 inline-block">
                      {member.memberId}
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-stone-100">
                      {member.name}
                    </h4>

                    <p className="text-[11px] text-amber-200 font-semibold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        {member.place || member.talukUnit || "Kollam"}, {member.district || "Kollam"}
                      </span>
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-300">
                      <span className="bg-amber-950 px-2 py-0.5 rounded border border-amber-600/40 text-amber-300 font-bold">
                        DOB: {dobParsed?.day} {MONTH_SHORT[(dobParsed?.month || 1) - 1]} {dobParsed?.year ? `(${dobParsed.year})` : ""}
                      </span>
                      {age !== undefined && (
                        <span className="bg-stone-800 px-2 py-0.5 rounded text-stone-200 font-bold">
                          Turning {age} Yrs
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons: Wish via Call / WhatsApp */}
                <div className="mt-3 pt-3 border-t border-amber-500/30 flex items-center gap-2">
                  <a
                    href={`tel:${member.phone}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call to Wish</span>
                  </a>
                  <a
                    href={`https://wa.me/${member.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Dear Sri/Smt ${member.name}, Hearty Birthday Greetings from Kollam District Maratha Welfare Association! 🎂🎉 May you be blessed with health and happiness!`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Wishes</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 text-center space-y-1">
          <Cake className="w-6 h-6 text-amber-400 mx-auto" />
          <p className="text-xs font-bold text-stone-300">
            No member birthdays recorded for today ({today.toLocaleDateString("en-IN", { day: "numeric", month: "short" })})
          </p>
          <p className="text-[11px] text-stone-400">
            Check upcoming birthdays in this month below or browse the month calendar.
          </p>
        </div>
      )}

      {/* SEARCH AND MONTH SELECTOR */}
      <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-3.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-black uppercase text-amber-300 tracking-wider">
              Browse Birthday Calendar
            </h4>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search member or place..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* 12 Month Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setSelectedMonth("ALL")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 text-xs ${
              selectedMonth === "ALL"
                ? "bg-amber-500 text-stone-950 font-black shadow-md"
                : "bg-stone-900 text-stone-300 hover:text-amber-300 border border-stone-800"
            }`}
          >
            All Year ({parsedMembers.filter((m) => m.dobParsed).length})
          </button>
          {MONTH_NAMES.map((mName, idx) => {
            const mNum = idx + 1;
            const count = parsedMembers.filter(
              (item) => item.dobParsed && item.dobParsed.month === mNum
            ).length;
            const isCurrentMonth = mNum === currentMonth;

            return (
              <button
                key={mNum}
                type="button"
                onClick={() => setSelectedMonth(mNum)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 text-xs flex items-center gap-1 ${
                  selectedMonth === mNum
                    ? "bg-amber-500 text-stone-950 font-black shadow-md"
                    : isCurrentMonth
                    ? "bg-amber-950/70 text-amber-300 border border-amber-500/50 hover:bg-amber-900"
                    : "bg-stone-900 text-stone-300 hover:text-amber-300 border border-stone-800"
                }`}
              >
                <span>{MONTH_SHORT[idx]}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedMonth === mNum
                      ? "bg-stone-950 text-amber-300"
                      : "bg-stone-800 text-stone-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTERED MEMBERS LIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-400">
          <span>
            Showing <strong>{filteredMembers.length}</strong> approved member
            {filteredMembers.length !== 1 ? "s" : ""} for{" "}
            <strong className="text-amber-300">
              {selectedMonth === "ALL" ? "All Year" : MONTH_NAMES[(selectedMonth as number) - 1]}
            </strong>
          </span>
        </div>

        {filteredMembers.length === 0 ? (
          <div className="p-8 bg-stone-950 rounded-2xl border border-stone-800 text-center space-y-2">
            <Cake className="w-8 h-8 text-stone-500 mx-auto" />
            <p className="text-sm font-bold text-stone-300">No member birthdays found</p>
            <p className="text-xs text-stone-400">
              No approved members with birthdays in the selected month or matching your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredMembers.map(({ member, dobParsed, isToday, age }) => (
              <div
                key={member.id}
                className={`bg-stone-950 rounded-2xl p-3.5 border transition-all relative space-y-2.5 ${
                  isToday
                    ? "border-amber-400 bg-amber-950/20 shadow-lg ring-1 ring-amber-400/50"
                    : "border-stone-800 hover:border-amber-500/40"
                }`}
              >
                {isToday && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-black text-[9px] uppercase">
                    Birthday Today!
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <img
                    src={
                      member.avatarUrl ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
                    }
                    alt={member.name}
                    className="w-12 h-14 rounded-xl object-cover border border-amber-500/40 bg-stone-800 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-mono text-amber-300 font-bold block truncate">
                      {member.memberId}
                    </span>
                    <h5 className="font-bold text-stone-100 text-xs sm:text-sm truncate">
                      {member.name}
                    </h5>
                    <p className="text-[11px] text-stone-400 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{member.place || member.talukUnit || "Kollam"}</span>
                    </p>
                  </div>
                </div>

                {/* Birthday & Age Tag */}
                <div className="flex items-center justify-between pt-1 border-t border-stone-800/80 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Cake className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-black text-amber-300">
                      {dobParsed?.day} {MONTH_SHORT[(dobParsed?.month || 1) - 1]}
                      {dobParsed?.year ? ` (${dobParsed.year})` : ""}
                    </span>
                  </div>
                  {age !== undefined && (
                    <span className="text-stone-300 font-bold bg-stone-900 px-2 py-0.5 rounded-md border border-stone-800">
                      Age: {age}
                    </span>
                  )}
                </div>

                {/* Quick Phone Call / Wish Link */}
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={`tel:${member.phone}`}
                    className="flex-1 py-1 px-2 rounded-lg bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-stone-300 font-semibold text-[10px] flex items-center justify-center gap-1 transition-all border border-stone-800"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call ({member.phone.slice(-5)})</span>
                  </a>
                  <a
                    href={`https://wa.me/${member.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Happy Birthday ${member.name}! Best wishes from Kollam District Maratha Welfare Association! 🎂`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1 px-2.5 rounded-lg bg-emerald-950 hover:bg-emerald-600 text-emerald-300 hover:text-white font-semibold text-[10px] flex items-center justify-center gap-1 transition-all border border-emerald-500/30"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>Wish</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

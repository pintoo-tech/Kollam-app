import React from "react";
import { TalukUnit } from "../types";
import { Building2, Phone, Users, MapPin, Calendar, CheckCircle2, ChevronRight } from "lucide-react";

interface TalukUnitsViewProps {
  talukUnits: TalukUnit[];
  onSelectTaluk: (talukName: string) => void;
}

export const TalukUnitsView: React.FC<TalukUnitsViewProps> = ({
  talukUnits,
  onSelectTaluk,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 text-stone-100 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-bold text-amber-100">
              Kollam District Regional & Taluk Units
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Kollam District Maratha Welfare Association operates through 7 active Taluk Units under Regd. No. KLM/TC/101/2024.
          </p>
        </div>

        <div className="px-4 py-2 bg-amber-950/80 rounded-xl border border-amber-600/40 text-amber-200 text-xs font-bold shrink-0">
          Total Registered Units: 7 Taluks
        </div>
      </div>

      {/* Grid of 7 Taluk Units */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {talukUnits.map((unit) => (
          <div
            key={unit.id}
            className="bg-stone-900 rounded-2xl p-5 border border-stone-800 hover:border-amber-500/50 transition-all shadow-md flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Unit Title and Code */}
              <div className="flex items-start justify-between gap-2 border-b border-stone-800 pb-3">
                <div>
                  <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/30">
                    {unit.code}
                  </span>
                  <h3 className="font-bold text-base text-stone-100 mt-1">
                    {unit.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1 bg-stone-950 px-2.5 py-1 rounded-lg border border-stone-800 text-amber-300 font-bold text-xs">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>{unit.memberCount} Members</span>
                </div>
              </div>

              {/* Area Covered */}
              <p className="text-xs text-stone-300 leading-relaxed bg-stone-950/70 p-2.5 rounded-xl border border-stone-800/80">
                <strong className="text-stone-400 block text-[10px] uppercase font-bold mb-0.5">
                  Coverage Area:
                </strong>
                {unit.areaDescription}
              </p>

              {/* Convenor Details */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400 text-[11px]">Unit Convenor:</span>
                  <span className="text-amber-200 font-bold">{unit.convenorName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400 text-[11px]">Contact Phone:</span>
                  <a
                    href={`tel:${unit.convenorPhone}`}
                    className="text-amber-400 font-mono font-bold hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3 text-emerald-400" />
                    <span>{unit.convenorPhone}</span>
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400 text-[11px]">Joint Convenor:</span>
                  <span className="text-stone-300">{unit.jointConvenor}</span>
                </div>
              </div>

              {/* Meeting Venue & Schedule */}
              <div className="space-y-1.5 text-xs bg-stone-950/50 p-2.5 rounded-xl border border-stone-800 text-stone-300">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-snug">{unit.meetingVenue}</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-300 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-[11px]">{unit.meetingSchedule}</span>
                </div>
              </div>

              {/* Active Taluk Projects */}
              <div>
                <span className="text-[10px] font-bold uppercase text-stone-400 block mb-1">
                  Active Taluk Initiatives:
                </span>
                <div className="flex flex-wrap gap-1">
                  {unit.activeProjects.map((p, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-[10px] bg-stone-950 text-amber-200 px-2 py-0.5 rounded-md border border-stone-800"
                    >
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action to view members of this taluk */}
            <button
              onClick={() => onSelectTaluk(unit.name)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-950/60 hover:bg-amber-900 text-amber-200 text-xs font-semibold border border-amber-600/40 transition-colors"
            >
              <span>View Members in {unit.name}</span>
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

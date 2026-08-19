import React from "react";
import { ExecutiveMember, CurrentUser } from "../types";
import { Award, Phone, Trash2, Shield } from "lucide-react";

interface ExecutiveCommitteeViewProps {
  committee: ExecutiveMember[];
  currentUser?: CurrentUser;
  onDeleteCommitteeMember?: (id: string, name?: string) => void;
  onOpenAdminPanel?: () => void;
}

export const ExecutiveCommitteeView: React.FC<ExecutiveCommitteeViewProps> = ({
  committee,
  currentUser,
  onDeleteCommitteeMember,
  onOpenAdminPanel,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 text-stone-100 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-bold text-amber-100">
              Committee Members
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Official committee members of the association.
          </p>
        </div>

        {currentUser?.role === "admin" && onOpenAdminPanel && (
          <button
            type="button"
            onClick={onOpenAdminPanel}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md transition-all self-start md:self-auto"
          >
            <Shield className="w-4 h-4" />
            <span>Manage Committee in Admin Panel</span>
          </button>
        )}
      </div>

      {/* Grid of Executive Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {committee.map((member) => (
          <div
            key={member.id}
            className="bg-stone-900 rounded-2xl p-5 border border-stone-800 hover:border-amber-500/50 transition-all shadow-md flex flex-col items-center text-center space-y-3 relative group"
          >
            <img
              src={member.photoUrl}
              alt={member.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500/50 shadow-md"
              referrerPolicy="no-referrer"
            />

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wide bg-amber-950 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-600/40 inline-block mb-1">
                {member.designation || (member as any).role || "Executive Member"}
              </span>
              <h3 className="font-bold text-stone-100 text-sm leading-tight">
                {member.name}
              </h3>
              <span className="text-[11px] text-stone-400 block mt-0.5">
                {member.talukUnit || (member as any).taluk || "Kollam District"}
              </span>
            </div>

            <p className="text-[11px] text-stone-300 bg-stone-950/70 p-2.5 rounded-xl border border-stone-800/80 w-full leading-normal">
              <strong className="text-stone-500 block text-[9px] uppercase font-bold">Portfolio:</strong>
              {member.portfolio}
            </p>

            <div className="w-full flex items-center gap-2">
              <a
                href={`tel:${member.phone}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-200 text-xs font-bold border border-amber-600/40 transition-colors font-mono"
                title={`Call ${member.name}`}
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{member.phone}</span>
              </a>
              {member.phone && (
                <a
                  href={`https://wa.me/${member.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Namaskar ${member.name} Ji, contacting you regarding Kollam District Maratha Welfare Association.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 px-2.5 rounded-xl bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/40 transition-colors flex items-center justify-center gap-1"
                  title={`Connect on WhatsApp with ${member.name}`}
                >
                  <span className="text-xs select-none" role="img" aria-label="WhatsApp">💬</span>
                  <span className="text-[10px] text-emerald-400 font-bold hidden sm:inline">WhatsApp</span>
                </a>
              )}
            </div>

            {currentUser?.role === "admin" && onDeleteCommitteeMember && (
              <button
                type="button"
                onClick={() => onDeleteCommitteeMember(member.id, member.name)}
                className="w-full py-1.5 px-3 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 hover:text-red-100 text-xs font-bold border border-red-700/50 flex items-center justify-center gap-1.5 transition-colors"
                title={`Remove ${member.name} from committee`}
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>Remove Member</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};


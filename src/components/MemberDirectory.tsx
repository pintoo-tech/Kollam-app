import React, { useState } from "react";
import { Member, KollamTaluk, CurrentUser } from "../types";
import {
  Search,
  Filter,
  CreditCard,
  Building2,
  Phone,
  Mail,
  UserCheck,
  ShieldAlert,
  Download,
  Users,
  Lock,
  LogIn,
  UserPlus,
  Shield,
  CheckCircle,
  UserCog,
  Edit,
} from "lucide-react";
import { LogoEmblem } from "./LogoEmblem";

interface MemberDirectoryProps {
  members: Member[];
  onSelectMemberForIdCard: (member: Member) => void;
  onOpenRegisterModal: () => void;
  currentUser?: CurrentUser;
  onOpenLoginModal?: () => void;
  onEditMemberProfile?: (member: Member) => void;
}

const DEFAULT_GUEST_USER: CurrentUser = { role: "guest" };

export const MemberDirectory: React.FC<MemberDirectoryProps> = ({
  members,
  onSelectMemberForIdCard,
  onOpenRegisterModal,
  currentUser = DEFAULT_GUEST_USER,
  onOpenLoginModal,
  onEditMemberProfile,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<string>("All");

  const placeOptions: (KollamTaluk | "All")[] = [
    "All",
    "Kollam Town & East",
    "Karunagappally",
    "Kottarakkara",
    "Punalur",
    "Pathanapuram",
    "Chathannoor & Paravur",
    "Kunnathur",
  ];

  // ACCESS CONTROL GATE:
  // "Allow Only after login, the member to see all the members directory and card and he can download self digital card but not any others. only admin can see all members data and download it."
  if (currentUser.role === "guest") {
    return (
      <div className="max-w-2xl mx-auto my-6 bg-stone-900 border border-amber-500/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
        <div className="flex justify-center">
          <LogoEmblem size="lg" showRegistrationBadge={false} />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 text-xs font-bold border border-amber-500/40">
            <Lock className="w-3.5 h-3.5" />
            <span>Members-Only Protected Area</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-amber-100 font-serif">
            Member Directory & Digital Pass Portal
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto leading-relaxed">
            Access to the Kollam Maratha Welfare Association members directory and digital membership cards is restricted to registered members and authorized association administrators.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {onOpenLoginModal && (
            <button
              onClick={onOpenLoginModal}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Login as Member</span>
            </button>
          )}

          <button
            onClick={onOpenRegisterModal}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs border border-stone-700 flex items-center justify-center gap-2 transition-all"
          >
            <UserPlus className="w-4 h-4 text-amber-400" />
            <span>Apply for New Membership</span>
          </button>
        </div>

        <div className="pt-4 border-t border-stone-800 text-[11px] text-stone-400">
          Already registered? Enter your Member ID (e.g. KLM-MWA-1001) or Phone Number in the login dialog.
        </div>
      </div>
    );
  }

  // Filter members by Name and Place only
  const filteredMembers = members.filter((m) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm.trim() ||
      m.name.toLowerCase().includes(q) ||
      m.memberId.toLowerCase().includes(q) ||
      (m.place || "").toLowerCase().includes(q);

    const matchesPlace =
      selectedPlace === "All" ||
      m.talukUnit === selectedPlace ||
      (m.place && m.place.toLowerCase() === selectedPlace.toLowerCase());

    return matchesSearch && matchesPlace;
  });

  return (
    <div className="space-y-6">
      {/* Logged in status banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900 p-5 rounded-2xl border border-stone-800 text-stone-100 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-bold text-amber-100">
              Member Directory
            </h2>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-stone-400">
              Total Listed Members: <strong className="text-amber-300">{filteredMembers.length}</strong>
            </span>
            {currentUser.role === "member" && currentUser.member && (
              <span className="text-[11px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                <span>Logged in: {currentUser.member.name} ({currentUser.member.memberId})</span>
              </span>
            )}
            {currentUser.role === "admin" && (
              <span className="text-[11px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                <Shield className="w-3 h-3 text-amber-400" />
                <span>Admin Mode Active</span>
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onOpenRegisterModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all shrink-0"
        >
          <span>Register New Member</span>
        </button>
      </div>

      {/* Filter Controls: Name & Place only */}
      <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Name / ID Search Box */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Member Name, ID (e.g. KLM-MWA-1001)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500 placeholder-stone-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-2.5 text-xs text-stone-400 hover:text-stone-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Place Filter */}
          <div>
            <select
              value={selectedPlace}
              onChange={(e) => setSelectedPlace(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
            >
              {placeOptions.map((t) => (
                <option key={t} value={t}>
                  {t === "All" ? "All Places / Areas" : t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-stone-400 text-[11px] pt-1">
          <span>Filtering by Name & Place</span>
          <span>
            Showing <strong className="text-amber-300">{filteredMembers.length}</strong> of {members.length} members
          </span>
        </div>
      </div>

      {/* Members Cards Grid */}
      {filteredMembers.length === 0 ? (
        <div className="bg-stone-900 rounded-2xl p-12 text-center border border-stone-800 space-y-3">
          <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-stone-200">
            No members found matching search criteria
          </h3>
          <p className="text-xs text-stone-400 max-w-md mx-auto">
            Try adjusting your search name or resetting the place filter.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedPlace("All");
            }}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-semibold rounded-xl border border-amber-600/30"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => {
            const isAdmin = currentUser.role === "admin";
            const isOwnCard =
              currentUser.role === "member" &&
              currentUser.member &&
              (currentUser.member.id === member.id || currentUser.member.memberId === member.memberId);

            return (
              <div
                key={member.id}
                className={`bg-stone-900 rounded-2xl p-5 border transition-all shadow-md flex flex-col justify-between space-y-4 group ${
                  isOwnCard
                    ? "border-amber-400 ring-2 ring-amber-500/30"
                    : "border-stone-800 hover:border-amber-600/50"
                }`}
              >
                <div className="space-y-3">
                  {/* Header Row: Avatar, Member ID, Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          member.avatarUrl ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
                        }
                        alt={member.name}
                        className="w-12 h-12 rounded-xl object-cover border border-amber-500/40 shadow-sm shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                            {member.memberId}
                          </span>
                          {isOwnCard && (
                            <span className="text-[9px] bg-emerald-500 text-stone-950 px-1.5 py-0.5 rounded font-black uppercase">
                              You
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-stone-100 text-sm mt-1 leading-snug group-hover:text-amber-300 transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-[11px] text-stone-400">
                          {member.place || member.talukUnit || "Kollam"}
                        </p>
                        {member.roll && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded font-semibold">
                              {member.roll}
                            </span>
                            {member.roll2 &&
                              member.roll2 !== "None" &&
                              !member.roll2.includes("None") &&
                              member.roll2 !== member.roll && (
                                <span className="text-[10px] bg-stone-800 text-stone-300 border border-stone-700 px-1.5 py-0.5 rounded font-medium">
                                  {member.roll2}
                                </span>
                              )}
                          </div>
                        )}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        member.status === "Life Member"
                          ? "bg-amber-900/80 text-amber-200 border border-amber-500/40"
                          : member.status === "Patron Member"
                          ? "bg-emerald-900/80 text-emerald-200 border border-emerald-500/40"
                          : "bg-stone-800 text-stone-300"
                      }`}
                    >
                      {member.status}
                    </span>
                  </div>

                  {/* Member Details */}
                  <div className="space-y-1.5 text-xs bg-stone-950/70 p-3 rounded-xl border border-stone-800/80">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-stone-500 uppercase font-bold">
                        Place / Area
                      </span>
                      <span className="text-stone-200 font-medium flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-amber-500 shrink-0" />
                        <span className="truncate">{member.place || member.talukUnit}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-stone-800/60">
                      <span className="text-[10px] text-stone-500 uppercase font-bold">
                        District
                      </span>
                      <span className="text-amber-300/90 font-medium">
                        {member.district || "Kollam"}
                      </span>
                    </div>

                    {member.bloodGroup && (
                      <div className="flex items-center justify-between pt-1 border-t border-stone-800/60">
                        <span className="text-[10px] text-stone-500 uppercase font-bold">
                          Blood Group
                        </span>
                        <span className="text-red-400 font-mono font-bold">
                          {member.bloodGroup}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Contact info */}
                  <div className="flex items-center justify-between text-xs text-stone-400 px-1 pt-1 gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={`tel:${member.phone}`}
                        className="flex items-center gap-1 text-amber-300 hover:underline font-mono text-[11px] hover:text-amber-200 transition-colors"
                        title={`Call ${member.name}`}
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{member.phone}</span>
                      </a>
                      {member.phone && (
                        <a
                          href={`https://wa.me/${member.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Namaskar Sri/Smt ${member.name}, contacting you from Kollam District Maratha Welfare Association.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 hover:text-emerald-100 border border-emerald-500/40 text-[11px] font-semibold transition-all shadow-sm group/wa"
                          title={`Connect on WhatsApp with ${member.name}`}
                        >
                          <span className="text-xs select-none" role="img" aria-label="WhatsApp">💬</span>
                          <span className="text-[10px] text-emerald-400 group-hover/wa:text-emerald-300 font-bold">WhatsApp</span>
                        </a>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-500 shrink-0">
                      Regd. {member.joiningYear || 2026}
                    </span>
                  </div>
                </div>

                {/* Card Footer Action: Only show Download/View for Own Card or Admin */}
                {isOwnCard ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {onEditMemberProfile && (
                      <button
                        type="button"
                        onClick={() => onEditMemberProfile(member)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all"
                      >
                        <UserCog className="w-3.5 h-3.5" />
                        <span>Edit Profile & Photo</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onSelectMemberForIdCard(member)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 border border-amber-400 shadow-md transition-all ${
                        !onEditMemberProfile ? "w-full sm:col-span-2" : ""
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>My Digital Card</span>
                    </button>
                  </div>
                ) : isAdmin ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {onEditMemberProfile && (
                      <button
                        type="button"
                        onClick={() => onEditMemberProfile(member)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Profile</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onSelectMemberForIdCard(member)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-amber-950/60 hover:bg-amber-900/80 text-amber-200 border border-amber-600/40 transition-colors ${
                        !onEditMemberProfile ? "w-full sm:col-span-2" : ""
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>ID Card (Admin)</span>
                    </button>
                  </div>
                ) : (
                  <div className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-[11px] font-medium text-stone-400 bg-stone-950/50 border border-stone-800/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span>Verified Registered Member</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

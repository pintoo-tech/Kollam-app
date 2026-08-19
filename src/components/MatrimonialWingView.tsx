import React, { useState } from "react";
import { MatrimonialProfile } from "../types";
import { Heart, Search, Filter, Phone, MapPin, Briefcase, GraduationCap, User, ShieldCheck } from "lucide-react";

interface MatrimonialWingViewProps {
  profiles: MatrimonialProfile[];
}

export const MatrimonialWingView: React.FC<MatrimonialWingViewProps> = ({
  profiles,
}) => {
  const [selectedGender, setSelectedGender] = useState<string>("All");
  const [selectedTaluk, setSelectedTaluk] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [contactModalProfile, setContactModalProfile] = useState<MatrimonialProfile | null>(null);

  const filteredProfiles = profiles.filter((p) => {
    const matchesGender = selectedGender === "All" || p.gender === selectedGender;
    const matchesTaluk = selectedTaluk === "All" || p.nativeTalukInKollam === selectedTaluk;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.qualification.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.occupation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.profileCode.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesGender && matchesTaluk && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 text-stone-100 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500" />
            <h2 className="text-xl font-bold text-amber-100">
              Kollam Maratha Matrimonial Alliance Registry
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Exclusive community matrimonial desk for Maratha families in Kollam District under Regd. No. KLM/TC/101/2024. Verified profiles.
          </p>
        </div>

        <div className="px-4 py-2 bg-amber-950/80 rounded-xl border border-amber-600/40 text-amber-200 text-xs font-bold shrink-0">
          Verified Kollam Maratha Profiles
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
            Seeking (Gender)
          </label>
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Profiles (Brides & Grooms)</option>
            <option value="Bride">Seeking Bridegroom (Bride Profiles)</option>
            <option value="Groom">Seeking Bride (Groom Profiles)</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
            Native Kollam Taluk
          </label>
          <select
            value={selectedTaluk}
            onChange={(e) => setSelectedTaluk(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Kollam Taluks</option>
            <option value="Kollam Town & East">Kollam Town & East</option>
            <option value="Karunagappally">Karunagappally</option>
            <option value="Kottarakkara">Kottarakkara</option>
            <option value="Punalur">Punalur</option>
            <option value="Pathanapuram">Pathanapuram</option>
            <option value="Chathannoor & Paravur">Chathannoor & Paravur</option>
            <option value="Kunnathur">Kunnathur</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
            Search Qualification / Name
          </label>
          <input
            type="text"
            placeholder="Search MBBS, Engineer, IT, Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProfiles.map((profile) => (
          <div
            key={profile.id}
            className="bg-stone-900 rounded-2xl p-5 border border-stone-800 hover:border-amber-500/50 transition-all shadow-md flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={profile.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"}
                    alt={profile.name}
                    className="w-14 h-16 rounded-xl object-cover border-2 border-amber-500/40 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/30">
                      {profile.profileCode}
                    </span>
                    <h3 className="font-bold text-base text-stone-100 mt-1">
                      {profile.name} ({profile.age} Yrs)
                    </h3>
                    <span className="text-xs text-rose-300 font-bold">
                      {profile.gender} Profile • Height: {profile.height}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  Verified Family
                </span>
              </div>

              <div className="space-y-2 text-xs bg-stone-950/70 p-3 rounded-xl border border-stone-800">
                <div className="flex items-center gap-2 text-stone-200">
                  <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>Education:</strong> {profile.qualification}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-200">
                  <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>Occupation:</strong> {profile.occupation} ({profile.companyLocation})</span>
                </div>
                <div className="flex items-center gap-2 text-stone-200">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>Native Kollam Taluk:</strong> {profile.nativeTalukInKollam}</span>
                </div>
                {profile.horoscopeRasi && (
                  <div className="flex items-center gap-2 text-amber-300 text-[11px] font-medium pt-1 border-t border-stone-800">
                    <span>✨ Horoscope Rasi / Star: {profile.horoscopeRasi}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setContactModalProfile(profile)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-stone-950" />
              <span>Request Alliance Contact ({profile.contactPerson})</span>
            </button>
          </div>
        ))}
      </div>

      {/* Alliance Contact Request Modal */}
      {contactModalProfile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-amber-600/50 rounded-2xl max-w-md w-full p-6 text-stone-100 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-amber-100">
              Alliance Contact Details
            </h3>
            <p className="text-xs text-stone-400">
              Kollam Maratha Matrimonial Bureau • Regd. No. KLM/TC/101/2024
            </p>

            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2 text-xs">
              <span className="text-[10px] text-amber-400 font-bold block uppercase">
                Profile Code: {contactModalProfile.profileCode}
              </span>
              <p className="text-sm font-bold text-stone-100">
                Candidate: {contactModalProfile.name}
              </p>
              <div className="pt-2 border-t border-stone-800 space-y-1">
                <span className="text-stone-400 block">Parent / Guardian Contact:</span>
                <span className="text-amber-300 font-bold text-sm block">
                  {contactModalProfile.contactPerson}
                </span>
                <a
                  href={`tel:${contactModalProfile.contactPhone}`}
                  className="text-emerald-400 font-mono font-black text-base hover:underline block"
                >
                  {contactModalProfile.contactPhone}
                </a>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setContactModalProfile(null)}
                className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

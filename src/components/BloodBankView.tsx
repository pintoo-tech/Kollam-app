import React, { useState } from "react";
import { BloodDonor } from "../types";
import { Droplet, Phone, Search, AlertCircle, CheckCircle2 } from "lucide-react";

interface BloodBankViewProps {
  donors: BloodDonor[];
}

export const BloodBankView: React.FC<BloodBankViewProps> = ({ donors }) => {
  const [selectedGroup, setSelectedGroup] = useState<string>("All");
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const bloodGroups = ["All", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const filteredDonors = donors.filter(
    (d) => selectedGroup === "All" || d.bloodGroup === selectedGroup
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 text-stone-100 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Droplet className="w-6 h-6 text-red-500 fill-red-500" />
            <h2 className="text-xl font-bold text-amber-100">
              Kollam Emergency Blood Donors Network
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Voluntary blood donor directory across Kollam District hospitals (District Hospital Kollam, Parippally Medical College, NS Hospital, Travancore Medicity).
          </p>
        </div>

        <button
          onClick={() => setEmergencyModalOpen(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 shrink-0"
        >
          <AlertCircle className="w-4 h-4 text-white" />
          <span>Post Emergency Blood Request</span>
        </button>
      </div>

      {/* Blood Group Filter Badges */}
      <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-2">
        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
          Filter Blood Group:
        </span>
        <div className="flex flex-wrap gap-2">
          {bloodGroups.map((bg) => (
            <button
              key={bg}
              onClick={() => setSelectedGroup(bg)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                selectedGroup === bg
                  ? "bg-red-600 text-white shadow-md scale-105"
                  : "bg-stone-950 text-stone-300 hover:bg-stone-800 border border-stone-800"
              }`}
            >
              {bg === "All" ? "All Groups" : `Group ${bg}`}
            </button>
          ))}
        </div>
      </div>

      {/* Donors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDonors.map((donor) => (
          <div
            key={donor.id}
            className="bg-stone-900 rounded-2xl p-4 border border-stone-800 hover:border-red-500/40 transition-all shadow-md flex items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-xl bg-red-950 text-red-300 border border-red-500/40 font-mono font-black text-sm flex items-center justify-center shrink-0">
                  {donor.bloodGroup}
                </span>
                <div>
                  <h3 className="font-bold text-stone-100 text-sm">{donor.name}</h3>
                  <span className="text-[11px] text-amber-300 font-medium">
                    {donor.talukUnit} ({donor.area})
                  </span>
                </div>
              </div>
            </div>

            <a
              href={`tel:${donor.phone}`}
              className="px-3 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-bold flex items-center gap-1 shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Call</span>
            </a>
          </div>
        ))}
      </div>

      {/* Emergency Request Modal */}
      {emergencyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-red-600/50 rounded-2xl max-w-md w-full p-6 text-stone-100 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Emergency Blood Request (Kollam)
            </h3>

            {requestSubmitted ? (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-stone-100">SOS Alert Broadcasted!</h4>
                <p className="text-xs text-stone-400">
                  Your blood requirement alert has been sent to Kollam Youth Wing donors. Coordinators will reach out immediately.
                </p>
                <button
                  onClick={() => {
                    setEmergencyModalOpen(false);
                    setRequestSubmitted(false);
                  }}
                  className="px-4 py-2 bg-amber-500 text-stone-950 font-bold text-xs rounded-xl"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setRequestSubmitted(true);
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Patient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Patient name"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-stone-300 font-bold block mb-1">Blood Group *</label>
                    <select className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100">
                      <option>O+</option>
                      <option>O-</option>
                      <option>A+</option>
                      <option>B+</option>
                      <option>AB+</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-stone-300 font-bold block mb-1">Units Needed *</label>
                    <input
                      type="number"
                      defaultValue={2}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Hospital Location in Kollam *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. District Hospital Kollam / Parippally Med College"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100"
                  />
                </div>
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Bystander Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 94470 00000"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-mono"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEmergencyModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold"
                  >
                    Send SOS Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

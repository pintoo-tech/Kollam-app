import React, { useState } from "react";
import { WelfareScheme, KollamTaluk } from "../types";
import {
  HeartHandshake,
  Award,
  Heart,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Send,
  X,
  Sparkles,
} from "lucide-react";

interface WelfareSchemesViewProps {
  schemes: WelfareScheme[];
}

export const WelfareSchemesView: React.FC<WelfareSchemesViewProps> = ({ schemes }) => {
  const [selectedSchemeForApply, setSelectedSchemeForApply] = useState<WelfareScheme | null>(null);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  // Form state
  const [applicantName, setApplicantName] = useState("");
  const [memberId, setMemberId] = useState("");
  const [talukUnit, setTalukUnit] = useState<KollamTaluk>("Kollam Town & East");
  const [phone, setPhone] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");
  const [reasonDetails, setReasonDetails] = useState("");

  const handleGrantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const appRef = `KLM-GRANT-${Math.floor(10000 + Math.random() * 90000)}`;
    setSubmittedAppId(appRef);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 text-stone-100 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-bold text-amber-100">
              Kollam Association Welfare & Educational Grants
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Financial aid, educational merit awards, medical emergency relief, and marriage grants for registered members of Kollam District under Regd. No. KLM/TC/101/2024.
          </p>
        </div>

        <div className="px-4 py-2 bg-amber-950/80 rounded-xl border border-amber-600/40 text-amber-200 text-xs font-bold shrink-0">
          Over ₹12.5 Lakhs Sanctioned in Kollam
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-stone-900 rounded-2xl p-6 border border-stone-800 hover:border-amber-500/50 transition-all shadow-md flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              {/* Badge & Title */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wide bg-amber-950 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-600/40">
                    {scheme.category} • {scheme.badge}
                  </span>
                  <h3 className="font-bold text-lg text-amber-100 mt-2 leading-snug">
                    {scheme.title}
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-amber-400 bg-black/60 px-2.5 py-1 rounded-lg border border-stone-800 shrink-0">
                  {scheme.code}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-stone-300 leading-relaxed">
                {scheme.description}
              </p>

              {/* Max Grant & Beneficiaries Stats */}
              <div className="grid grid-cols-2 gap-3 bg-stone-950 p-3 rounded-xl border border-stone-800 text-xs">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">
                    Max Financial Assistance
                  </span>
                  <span className="text-emerald-400 font-extrabold text-sm mt-0.5 block">
                    {scheme.maxGrantAmount}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">
                    Kollam Beneficiaries
                  </span>
                  <span className="text-amber-300 font-extrabold text-sm mt-0.5 block">
                    {scheme.beneficiariesCountInKollam} Families Aid
                  </span>
                </div>
              </div>

              {/* Eligibility Criteria */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  Eligibility Criteria:
                </span>
                <ul className="space-y-1">
                  {scheme.eligibilityCriteria.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-stone-300 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Documents Required */}
              <div className="space-y-1 text-xs">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Mandatory Attachments:
                </span>
                <div className="flex flex-wrap gap-1">
                  {scheme.documentsRequired.map((doc, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-stone-950 text-stone-300 px-2 py-0.5 rounded border border-stone-800"
                    >
                      📄 {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={() => {
                setSelectedSchemeForApply(scheme);
                setSubmittedAppId(null);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all"
            >
              <Send className="w-3.5 h-3.5 text-stone-950" />
              <span>Apply for {scheme.category} Grant Online</span>
            </button>
          </div>
        ))}
      </div>

      {/* Online Grant Application Modal */}
      {selectedSchemeForApply && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-amber-600/50 rounded-2xl max-w-lg w-full p-6 text-stone-100 shadow-2xl relative space-y-5 my-8">
            <button
              onClick={() => setSelectedSchemeForApply(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            {submittedAppId ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-950 border border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-amber-100">
                  Grant Application Submitted!
                </h3>
                <p className="text-xs text-stone-300 max-w-sm mx-auto">
                  Your application for <strong className="text-amber-300">{selectedSchemeForApply.title}</strong> has been received by Kollam Executive Committee.
                </p>
                <div className="bg-stone-950 p-4 rounded-xl border border-amber-500/40 font-mono text-center space-y-1">
                  <span className="text-[10px] text-stone-400 block uppercase font-bold">
                    Application Tracking Reference ID
                  </span>
                  <span className="text-lg font-black text-amber-400 block">
                    {submittedAppId}
                  </span>
                  <span className="text-[10px] text-emerald-400 block">
                    Regd. No. KLM/TC/101/2024
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Please keep this reference ID for tracking. Your local Kollam Taluk Unit Convenor will verify the documents within 3 working days.
                </p>
                <button
                  onClick={() => setSelectedSchemeForApply(null)}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="pr-8 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-600/30">
                    Official Grant Application
                  </span>
                  <h3 className="text-lg font-bold text-amber-100">
                    {selectedSchemeForApply.title}
                  </h3>
                  <p className="text-xs text-stone-400">
                    Max Aid: {selectedSchemeForApply.maxGrantAmount} • Regd. KLM/TC/101/2024
                  </p>
                </div>

                <form onSubmit={handleGrantSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="text-stone-300 font-bold block mb-1">
                      Applicant Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sri. Ramesh Rao"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-stone-300 font-bold block mb-1">
                        Kollam Member ID *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. KLM-MWA-1001"
                        value={memberId}
                        onChange={(e) => setMemberId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-stone-300 font-bold block mb-1">
                        Kollam Taluk Unit *
                      </label>
                      <select
                        value={talukUnit}
                        onChange={(e) => setTalukUnit(e.target.value as KollamTaluk)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500"
                      >
                        <option value="Kollam Town & East">Kollam Town & East</option>
                        <option value="Karunagappally">Karunagappally</option>
                        <option value="Kottarakkara">Kottarakkara</option>
                        <option value="Punalur">Punalur</option>
                        <option value="Pathanapuram">Pathanapuram</option>
                        <option value="Chathannoor & Paravur">Chathannoor & Paravur</option>
                        <option value="Kunnathur">Kunnathur</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-stone-300 font-bold block mb-1">
                        Contact Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 94470 00000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-stone-300 font-bold block mb-1">
                        Requested Amount (₹) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 15,000"
                        value={requestedAmount}
                        onChange={(e) => setRequestedAmount(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-stone-300 font-bold block mb-1">
                      Reason / Justification Details *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe course details / medical diagnosis / marriage date..."
                      value={reasonDetails}
                      onChange={(e) => setReasonDetails(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="bg-amber-950/40 p-3 rounded-xl border border-amber-600/30 text-[11px] text-amber-200">
                    ℹ️ Hardcopies of required certificates must be presented to your local Taluk Unit Convenor or uploaded at HQ.
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedSchemeForApply(null)}
                      className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-lg"
                    >
                      Submit Grant Application
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from "react";
import { DownloadResource } from "../types";
import { FileDown, FileText, Download, CheckCircle2, ShieldCheck, Printer, Eye } from "lucide-react";

interface ResourceDownloadsViewProps {
  resources: DownloadResource[];
}

export const ResourceDownloadsView: React.FC<ResourceDownloadsViewProps> = ({
  resources,
}) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [selectedResourceModal, setSelectedResourceModal] = useState<DownloadResource | null>(null);

  const handleSimulateDownload = (resource: DownloadResource) => {
    setDownloadingId(resource.id);
    setTimeout(() => {
      setDownloadingId(null);
      setSelectedResourceModal(resource);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 text-stone-100 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileDown className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-bold text-amber-100">
              Kollam Association Official Resources & Downloads
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Printable PDF membership forms, welfare grant applications, matrimonial registry forms, and registered bye-laws under Regd. No. KLM/TC/101/2024.
          </p>
        </div>

        <div className="px-4 py-2 bg-amber-950/80 rounded-xl border border-amber-600/40 text-amber-200 text-xs font-bold shrink-0">
          Official PDF Forms
        </div>
      </div>

      {/* Grid of Downloadable Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {resources.map((res) => (
          <div
            key={res.id}
            className="bg-stone-900 rounded-2xl p-5 border border-stone-800 hover:border-amber-500/50 transition-all shadow-md flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wide bg-amber-950 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-600/40">
                  {res.category}
                </span>
                <span className="font-mono text-[10px] font-bold text-stone-400 bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                  {res.formNumber}
                </span>
              </div>

              <h3 className="font-bold text-base text-amber-100 leading-snug">
                {res.title}
              </h3>

              <p className="text-xs text-stone-300 leading-relaxed bg-stone-950/60 p-3 rounded-xl border border-stone-800/80">
                {res.description}
              </p>

              <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
                <span className="flex items-center gap-1 font-mono text-[11px] text-amber-400">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{res.fileFormat} Document ({res.fileSize})</span>
                </span>
                <span className="text-emerald-400 font-bold text-[10px]">
                  Regd. KLM/TC/101/2024
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-800">
              <button
                onClick={() => setSelectedResourceModal(res)}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Preview</span>
              </button>

              <button
                onClick={() => handleSimulateDownload(res)}
                disabled={downloadingId === res.id}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-stone-950" />
                <span>{downloadingId === res.id ? "Downloading..." : "Download PDF"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview / Print Form Modal */}
      {selectedResourceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-amber-600/50 rounded-2xl max-w-lg w-full p-6 text-stone-100 shadow-2xl relative space-y-5 my-8">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-600/30">
                {selectedResourceModal.formNumber}
              </span>
              <h3 className="text-lg font-black text-amber-100">
                {selectedResourceModal.title}
              </h3>
              <p className="text-xs text-stone-400">
                Official Form • Kollam District Maratha Welfare Association (Regd. No. KLM/TC/101/2024)
              </p>
            </div>

            {/* Simulated Form Layout */}
            <div className="bg-stone-950 p-5 rounded-xl border border-stone-800 space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-amber-950/40 rounded-lg border border-amber-600/30 text-amber-200 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  This document is certified by Kollam District Headquarters, Anandavalleswaram.
                </span>
              </div>

              <div className="space-y-1">
                <strong className="text-amber-400 block">Form Purpose:</strong>
                <p className="text-stone-300">{selectedResourceModal.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-stone-900 p-2.5 rounded-lg border border-stone-800">
                <div>
                  <span className="text-stone-500 font-bold block">FORMAT:</span>
                  <span className="text-stone-200 font-mono">{selectedResourceModal.fileFormat}</span>
                </div>
                <div>
                  <span className="text-stone-500 font-bold block">FILE SIZE:</span>
                  <span className="text-stone-200 font-mono">{selectedResourceModal.fileSize}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedResourceModal(null)}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg"
              >
                <Printer className="w-4 h-4 text-stone-950" />
                <span>Print Form</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

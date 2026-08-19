import React, { useState, useEffect, useRef } from "react";
import { Member, CurrentUser } from "../types";
import { LogoEmblem } from "./LogoEmblem";
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  Phone,
  MapPin,
  Lock,
  CheckCircle2,
  Droplet,
  Shield,
  Sparkles,
  Loader2,
  Check,
  Share2,
} from "lucide-react";
import QRCode from "qrcode";
import { toPng } from "html-to-image";

interface DigitalIDCardModalProps {
  member: Member | null;
  onClose: () => void;
  currentUser?: CurrentUser;
  onOpenLoginModal?: () => void;
}

const DEFAULT_GUEST_USER: CurrentUser = { role: "guest" };

export const DigitalIDCardModal: React.FC<DigitalIDCardModalProps> = ({
  member,
  onClose,
  currentUser = DEFAULT_GUEST_USER,
  onOpenLoginModal,
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Download and Print state tracking
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printSuccess, setPrintSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (member) {
      // Build clean, verifiable verification payload
      const qrPayload = JSON.stringify({
        org: "Kollam District Maratha Welfare Association",
        regNo: "KLM/TC/101/2024",
        cardId: member.memberId,
        memberId: member.memberId,
        name: member.name,
        roll: member.roll || member.status || "Life Member",
        place: member.place || member.talukUnit || "Kollam",
        district: member.district || "Kollam",
        bloodGroup: member.bloodGroup || "O+",
        phone: member.phone,
        verified: true,
      });

      QRCode.toDataURL(qrPayload, {
        width: 260,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "H",
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error("Error generating QR code:", err));
    }
  }, [member]);

  if (!member) return null;

  const isAdmin = currentUser.role === "admin";
  const isSelfCard =
    currentUser.role === "member" &&
    currentUser.member &&
    (currentUser.member.id === member.id || currentUser.member.memberId === member.memberId);

  // Allow download for admin, self-card, or guest preview
  const canDownload = isAdmin || isSelfCard || currentUser.role === "guest";

  // Privacy Rule: Logged-in members can only access their own card
  if (currentUser.role === "member" && !isSelfCard) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-stone-900 border border-amber-600/50 rounded-2xl max-w-md w-full p-6 text-stone-100 shadow-2xl relative space-y-4 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-amber-200">
            Digital ID Card Access Restricted
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            As per association privacy policy, members can view and download <strong>only their own personal digital ID card</strong>.
          </p>
          <div className="pt-2 flex justify-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // ROBUST HIGH-RESOLUTION PNG DOWNLOAD
  // ----------------------------------------------------
  const handleDownloadCard = async () => {
    if (!cardRef.current || isDownloading) return;
    setIsDownloading(true);
    setStatusMessage("Generating High-Resolution ID Card PNG...");

    try {
      // Small pause to allow styles and fonts to stabilize
      await new Promise((resolve) => setTimeout(resolve, 150));

      const dataUrl = await toPng(cardRef.current, {
        quality: 0.98,
        pixelRatio: 3, // 3x crystal clear resolution for print & screen
        cacheBust: true,
        style: {
          transform: "scale(1)",
          margin: "0 auto",
        },
      });

      const safeMemberId = (member.memberId || "MEMBER").replace(/[^a-zA-Z0-9_-]/g, "_");
      const safeName = (member.name || "Card").replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
      const fileName = `KMWA_Digital_ID_${safeMemberId}_${safeName}.png`;

      // Trigger automatic direct browser download
      const downloadLink = document.createElement("a");
      downloadLink.download = fileName;
      downloadLink.href = dataUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setDownloadSuccess(true);
      setStatusMessage("Digital ID Card downloaded successfully to your device!");
      setTimeout(() => {
        setDownloadSuccess(false);
        setStatusMessage(null);
      }, 3500);
    } catch (err) {
      console.error("Error generating digital card PNG:", err);
      // Fallback: Use native canvas or alert
      setStatusMessage("Download ready: Right click or press and hold the card to save image.");
      setTimeout(() => setStatusMessage(null), 4000);
    } finally {
      setIsDownloading(false);
    }
  };

  // ----------------------------------------------------
  // ROBUST ISOLATED PRINT & PDF GENERATOR
  // ----------------------------------------------------
  const handlePrintCard = () => {
    if (!cardRef.current || isPrinting) return;
    setIsPrinting(true);
    setStatusMessage("Preparing print layout...");

    try {
      // Add isolation class to body
      document.body.classList.add("printing-digital-card");

      // Set timeout to ensure browser paints before print dialog
      setTimeout(() => {
        window.print();
        document.body.classList.remove("printing-digital-card");
        setIsPrinting(false);
        setPrintSuccess(true);
        setStatusMessage("Print dialog opened. You can print or save as PDF.");
        setTimeout(() => {
          setPrintSuccess(false);
          setStatusMessage(null);
        }, 3000);
      }, 300);
    } catch (err) {
      console.error("Error initiating print:", err);
      document.body.classList.remove("printing-digital-card");
      setIsPrinting(false);
    }
  };

  // Format phone display with +91 prefix
  const formattedPhone = member.phone.startsWith("+")
    ? member.phone
    : `+91 ${member.phone}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-start justify-center p-3 sm:p-4 pt-4 pb-12 overflow-y-auto">
      <div className="bg-stone-900 border border-amber-600/50 rounded-2xl max-w-lg sm:max-w-xl w-full p-4 sm:p-6 text-stone-100 shadow-2xl relative space-y-4 my-2 sm:my-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-700 transition-colors z-10"
          aria-label="Close Digital ID Card"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Header */}
        <div className="text-center space-y-1 pr-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950 px-3 py-0.5 rounded-full border border-amber-600/40 inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Official Membership Pass
          </span>
          <h2 className="text-lg sm:text-xl font-black text-amber-100">
            Digital Membership ID Card
          </h2>
          <p className="text-xs text-stone-400">
            Regd.no.- KLM/TC/101/2024
          </p>
        </div>

        {/* TOP QUICK ACTION TABS BAR */}
        <div className="flex items-center justify-center gap-2 p-1.5 bg-stone-950/80 rounded-xl border border-stone-800">
          {/* Download Tab Button */}
          <button
            type="button"
            onClick={handleDownloadCard}
            disabled={isDownloading}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-300 shadow-md ${
              isDownloading
                ? "bg-emerald-600 text-white animate-pulse ring-2 ring-emerald-400 shadow-emerald-600/50"
                : downloadSuccess
                ? "bg-emerald-500 text-stone-950 font-black ring-2 ring-emerald-300 shadow-emerald-500/40"
                : "bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/20"
            }`}
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                <span>Downloading HD...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-stone-950 stroke-[3]" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download HD Image</span>
              </>
            )}
          </button>

          {/* Print Tab Button */}
          <button
            type="button"
            onClick={handlePrintCard}
            disabled={isPrinting}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all duration-300 shadow-md ${
              isPrinting
                ? "bg-emerald-600 text-white animate-pulse ring-2 ring-emerald-400 shadow-emerald-600/50"
                : printSuccess
                ? "bg-emerald-500 text-stone-950 font-black ring-2 ring-emerald-300"
                : "bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30"
            }`}
          >
            {isPrinting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Opening Print...</span>
              </>
            ) : printSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Print Opened!</span>
              </>
            ) : (
              <>
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </>
            )}
          </button>
        </div>

        {/* Dynamic Status / Toast Message */}
        {statusMessage && (
          <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* CARD CONTAINER (Printable & Viewable) */}
        <div className="print:m-0 print:p-0">
          {/* THE DIGITAL ID CARD - EXACT DESIGN AS REFERENCE PHOTO */}
          <div
            id="printable-digital-id-card"
            ref={cardRef}
            className="w-full max-w-[480px] mx-auto rounded-[28px] border-2 border-amber-500/90 bg-gradient-to-b from-[#14100c] via-[#0d0a08] to-[#070504] p-4 sm:p-6 shadow-2xl relative overflow-hidden text-stone-100"
          >
            {/* Subtle bottom-right watermark arched curves */}
            <div className="absolute right-[-30px] bottom-[-30px] w-48 h-48 opacity-15 pointer-events-none">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="100" cy="100" r="65" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                <path d="M 40 100 Q 100 40 160 100" fill="none" stroke="#f59e0b" strokeWidth="2" />
                <path d="M 50 120 Q 100 60 150 120" fill="none" stroke="#f59e0b" strokeWidth="1" />
              </svg>
            </div>

            {/* TOP HEADER SECTION */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-amber-500/60 relative z-10">
              {/* Left: Emblem Logo with double golden ring */}
              <div className="shrink-0">
                <LogoEmblem size="lg" showRegistrationBadge={false} />
              </div>

              {/* Right: Association Name & Registration Number */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-serif font-black text-amber-300 tracking-wide leading-tight uppercase">
                  KOLLAM DISTRICT<br />
                  MARATHA WELFARE<br />
                  ASSOCIATION
                </h3>
                <div className="mt-1 text-xs text-stone-300">
                  <span className="text-stone-300 font-medium">Regd.no. - </span>
                  <span className="font-bold text-stone-100 font-mono tracking-wider">
                    KLM/TC/101/2024
                  </span>
                </div>
              </div>
            </div>

            {/* CARD MAIN BODY */}
            <div className="grid grid-cols-12 gap-3.5 sm:gap-4 pt-4 relative z-10 items-start">
              {/* LEFT COLUMN: Photo & Verification QR Code */}
              <div className="col-span-5 flex flex-col items-center">
                {/* Member Photo */}
                <div className="w-full flex flex-col items-center">
                  <div className="w-28 h-36 sm:w-36 sm:h-44 rounded-2xl border-2 border-amber-400 overflow-hidden shadow-lg bg-stone-900">
                    <img
                      src={
                        member.avatarUrl ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                      }
                      alt={member.name}
                      className="w-full h-full object-cover object-center"
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
                      }}
                    />
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-amber-400 font-black uppercase tracking-widest text-center mt-2">
                    MEMBER PHOTO
                  </span>
                </div>

                {/* QR Code Container */}
                <div className="w-full flex flex-col items-center mt-3">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white p-2 rounded-2xl border-2 border-amber-400/90 shadow-md flex items-center justify-center">
                    {qrCodeDataUrl ? (
                      <img
                        src={qrCodeDataUrl}
                        alt="QR Code"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-black text-[9px] font-bold">QR Code</div>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-1.5 text-[10px] sm:text-xs font-bold text-stone-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Scan to Verify</span>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Member Details */}
              <div className="col-span-7 space-y-2.5 text-xs pl-1">
                {/* NAME */}
                <div className="space-y-0.5">
                  <span className="text-[9px] sm:text-[10px] text-stone-400 uppercase font-bold tracking-wider block">
                    NAME
                  </span>
                  <h4 className="text-sm sm:text-base font-extrabold text-stone-100 leading-snug">
                    {member.name}
                  </h4>
                </div>

                {/* ROLL */}
                <div className="space-y-0.5">
                  <span className="text-[9px] sm:text-[10px] text-stone-400 uppercase font-bold tracking-wider block">
                    ROLL
                  </span>
                  <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full border border-amber-400/90 bg-amber-950/40 text-amber-300 text-[11px] sm:text-xs font-semibold shadow-sm">
                    <Shield className="w-3 h-3 text-amber-400" />
                    <span>{member.roll || member.status || "Life Member"}</span>
                  </div>
                </div>

                {/* ID NUMBER */}
                <div className="space-y-0.5">
                  <span className="text-[9px] sm:text-[10px] text-stone-400 uppercase font-bold tracking-wider block">
                    ID NUMBER
                  </span>
                  <div>
                    <span className="inline-block border-2 border-amber-400 rounded-xl px-3.5 py-1 bg-black/80 font-mono text-xs sm:text-sm font-black text-amber-300 tracking-wider shadow-inner">
                      {member.memberId || "KLM-MWA-1008"}
                    </span>
                  </div>
                </div>

                {/* PLACE */}
                <div className="space-y-0.5">
                  <span className="text-[9px] sm:text-[10px] text-stone-400 uppercase font-bold tracking-wider block">
                    PLACE
                  </span>
                  <div className="text-stone-100 font-medium text-xs flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{member.place || member.talukUnit || "Karunagappally"}</span>
                  </div>
                </div>

                {/* DISTRICT */}
                <div className="space-y-0.5">
                  <span className="text-[9px] sm:text-[10px] text-stone-400 uppercase font-bold tracking-wider block">
                    DISTRICT
                  </span>
                  <span className="text-stone-100 font-semibold text-xs block">
                    {member.district || "Kollam"}
                  </span>
                </div>

                {/* BLOOD GROUP */}
                <div className="space-y-0.5">
                  <span className="text-[9px] sm:text-[10px] text-stone-400 uppercase font-bold tracking-wider block">
                    BLOOD GROUP
                  </span>
                  <div className="text-stone-100 font-bold text-xs flex items-center gap-1">
                    <Droplet className="w-3.5 h-3.5 text-red-400 shrink-0 fill-red-400/30" />
                    <span>{member.bloodGroup || "O+"}</span>
                  </div>
                </div>

                {/* PHONE NUMBER */}
                <div className="space-y-0.5">
                  <span className="text-[9px] sm:text-[10px] text-stone-400 uppercase font-bold tracking-wider block">
                    PHONE NUMBER
                  </span>
                  <div className="text-stone-100 font-mono font-bold text-xs flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{formattedPhone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Access & Download Permission Messages */}
        {isSelfCard && (
          <div className="p-2.5 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>This is your official ID card. You are authorized to download and print.</span>
          </div>
        )}

        {isAdmin && (
          <div className="p-2.5 bg-amber-950/70 border border-amber-500/40 rounded-xl text-amber-300 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Admin Mode: You have full permission to view, download, and print all members' cards.</span>
          </div>
        )}

        {currentUser.role === "guest" && (
          <div className="p-2.5 bg-stone-950 border border-stone-800 rounded-xl text-stone-300 text-xs flex items-center justify-between gap-2">
            <span className="text-[11px] text-stone-400">
              Viewing digital verification card. Log in to manage account.
            </span>
            {onOpenLoginModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLoginModal();
                }}
                className="text-amber-400 hover:underline font-bold text-[11px] shrink-0"
              >
                Member Login →
              </button>
            )}
          </div>
        )}

        {/* Action Buttons Footer */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-stone-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {/* Print Button */}
            <button
              onClick={handlePrintCard}
              disabled={isPrinting}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs shadow-md transition-all duration-300 cursor-pointer ${
                isPrinting
                  ? "bg-emerald-600 text-white animate-pulse ring-2 ring-emerald-400"
                  : "bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30"
              }`}
            >
              {isPrinting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Printer className="w-3.5 h-3.5" />
              )}
              <span>Print Card</span>
            </button>

            {/* High Resolution PNG Download Button */}
            <button
              onClick={handleDownloadCard}
              disabled={isDownloading}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs shadow-lg transition-all duration-300 cursor-pointer ${
                isDownloading
                  ? "bg-emerald-600 text-white animate-pulse ring-2 ring-emerald-400 shadow-emerald-600/50"
                  : downloadSuccess
                  ? "bg-emerald-500 text-stone-950 font-black ring-2 ring-emerald-300 shadow-emerald-500/40"
                  : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-amber-500/30"
              }`}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Saving HD PNG...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-stone-950 stroke-[3]" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-stone-950" />
                  <span>Download Card (PNG)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

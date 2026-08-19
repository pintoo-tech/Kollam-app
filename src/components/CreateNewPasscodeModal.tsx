import React, { useState } from "react";
import { Member } from "../types";
import { LogoEmblem } from "./LogoEmblem";
import {
  ShieldAlert,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

interface CreateNewPasscodeModalProps {
  isOpen: boolean;
  member: Member;
  onSaveNewPasscode: (newPasscode: string) => Promise<void> | void;
  onClose?: () => void;
}

export const CreateNewPasscodeModal: React.FC<CreateNewPasscodeModalProps> = ({
  isOpen,
  member,
  onSaveNewPasscode,
  onClose,
}) => {
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const p1 = newPasscode.trim().replace(/\D/g, "");
    const p2 = confirmPasscode.trim().replace(/\D/g, "");

    if (p1.length !== 4) {
      setErrorMsg("New passcode must be exactly 4 numeral digits (0-9).");
      return;
    }

    if (p1 === "1234") {
      setErrorMsg("Please choose a new 4-digit passcode different from the default '1234'.");
      return;
    }

    if (p1 !== p2) {
      setErrorMsg("Passcodes do not match. Please re-enter carefully.");
      return;
    }

    try {
      setIsSaving(true);
      await onSaveNewPasscode(p1);
      setSavedSuccess(true);
      setTimeout(() => {
        setIsSaving(false);
        if (onClose) onClose();
      }, 1200);
    } catch (err) {
      console.error("Error saving new passcode:", err);
      setErrorMsg("Failed to save passcode. Please try again.");
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-900 border-2 border-amber-500 rounded-3xl max-w-md w-full p-6 text-stone-100 shadow-2xl relative space-y-5 my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Emblem */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <LogoEmblem size="md" showRegistrationBadge={false} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
            <KeyRound className="w-3.5 h-3.5" />
            <span>First Login Security Setup</span>
          </div>
          <h2 className="text-xl font-black text-amber-100 tracking-tight">
            Create Your 4-Digit Passcode
          </h2>
          <p className="text-xs text-stone-300 leading-relaxed px-2">
            Welcome, <strong className="text-amber-300">{member.name}</strong> ({member.memberId})!
            Your account is currently using the initial default passcode (<code className="text-amber-400 bg-stone-950 px-1 py-0.5 rounded font-mono">1234</code>).
            Please create your private <strong>4-digit numeric passcode</strong> to secure your account.
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 bg-red-950/90 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-start gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success notification */}
        {savedSuccess && (
          <div className="p-3 bg-emerald-950/90 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-start gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>New 4-digit passcode activated successfully! Opening portal...</span>
          </div>
        )}

        {/* Setup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Passcode */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-amber-300 block flex items-center justify-between">
              <span>New 4-Digit Passcode (Numbers Only) *</span>
              <span className="text-[10px] text-stone-400 font-mono">
                {newPasscode.length}/4 digits
              </span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type={showNew ? "text" : "password"}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                required
                placeholder="Enter 4 numbers (e.g. 5824)"
                value={newPasscode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setNewPasscode(val);
                  setErrorMsg("");
                }}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-500 placeholder-stone-500 font-mono tracking-widest font-bold"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-200"
                tabIndex={-1}
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Passcode */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-amber-300 block flex items-center justify-between">
              <span>Confirm New 4-Digit Passcode *</span>
              <span className="text-[10px] text-stone-400 font-mono">
                {confirmPasscode.length}/4 digits
              </span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type={showConfirm ? "text" : "password"}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                required
                placeholder="Re-enter same 4 numbers"
                value={confirmPasscode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setConfirmPasscode(val);
                  setErrorMsg("");
                }}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-500 placeholder-stone-500 font-mono tracking-widest font-bold"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-200"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-stone-300 text-[11px] flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              Only numeral numbers (0-9) are accepted. Remember this 4-digit code to log in and download your digital ID card in future sessions.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSaving || savedSuccess}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <span>Saving New Passcode...</span>
            ) : savedSuccess ? (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Passcode Set Successfully!
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Save Passcode & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { Member } from "../types";
import { LogoEmblem } from "./LogoEmblem";
import {
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

interface ChangeMemberPasscodeModalProps {
  isOpen: boolean;
  member: Member;
  onSaveNewPasscode: (newPasscode: string) => Promise<void> | void;
  onClose: () => void;
}

export const ChangeMemberPasscodeModal: React.FC<ChangeMemberPasscodeModalProps> = ({
  isOpen,
  member,
  onSaveNewPasscode,
  onClose,
}) => {
  const [currentPasscode, setCurrentPasscode] = useState("");
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const currentClean = currentPasscode.trim();
    const expectedCurrent = member.password || "1234";

    // Validate current passcode if member already set one
    if (member.hasChangedPasscode && currentClean && currentClean !== expectedCurrent) {
      setErrorMsg("The current passcode you entered is incorrect.");
      return;
    }

    const p1 = newPasscode.trim().replace(/\D/g, "");
    const p2 = confirmPasscode.trim().replace(/\D/g, "");

    if (p1.length !== 4) {
      setErrorMsg("New passcode must be exactly 4 numeric digits (0-9).");
      return;
    }

    if (p1 !== p2) {
      setErrorMsg("New passcodes do not match. Please re-enter carefully.");
      return;
    }

    try {
      setIsSaving(true);
      await onSaveNewPasscode(p1);
      setSavedSuccess(true);
      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error saving updated member passcode:", err);
      setErrorMsg("Could not save new passcode. Please try again.");
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-900 border-2 border-amber-500/80 rounded-3xl max-w-md w-full p-6 text-stone-100 shadow-2xl relative space-y-5 my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <LogoEmblem size="sm" showRegistrationBadge={false} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Member Account Security</span>
          </div>
          <h2 className="text-xl font-black text-amber-100 tracking-tight">
            Reset / Change Passcode
          </h2>
          <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800 text-xs text-stone-300 flex items-center justify-between">
            <div className="text-left">
              <span className="font-bold text-amber-200 block">{member.name}</span>
              <span className="text-[11px] text-stone-400 font-mono">{member.memberId}</span>
            </div>
            <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-600/30">
              {member.talukUnit || "Kollam"}
            </span>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 bg-red-950/90 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success message */}
        {savedSuccess && (
          <div className="p-3 bg-emerald-950/90 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Your new 4-digit passcode has been saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Passcode (If already changed) */}
          {member.hasChangedPasscode && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300 block">
                Current Passcode
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type={showCurrent ? "text" : "password"}
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter your current passcode"
                  value={currentPasscode}
                  onChange={(e) => {
                    setCurrentPasscode(e.target.value);
                    setErrorMsg("");
                  }}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-mono text-center text-sm tracking-widest focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-200"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* New Passcode */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-amber-300 block flex items-center justify-between">
              <span>New 4-Digit Numeric Passcode *</span>
              <span className="text-[10px] text-stone-400 font-mono">
                {newPasscode.length}/4 digits
              </span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
              <input
                type={showNew ? "text" : "password"}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                required
                autoFocus
                placeholder="4-digit PIN (e.g. 5824)"
                value={newPasscode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setNewPasscode(val);
                  setErrorMsg("");
                }}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-stone-950 border border-amber-500/60 text-amber-300 font-mono font-bold text-center text-base tracking-widest focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-200"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Passcode */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-amber-300 block flex items-center justify-between">
              <span>Confirm New 4-Digit Passcode *</span>
              <span className="text-[10px] text-stone-400 font-mono">
                {confirmPasscode.length}/4 digits
              </span>
            </label>
            <div className="relative">
              <ShieldCheck className="w-4 h-4 text-amber-400 absolute left-3.5 top-3" />
              <input
                type={showConfirm ? "text" : "password"}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                required
                placeholder="Re-enter 4-digit PIN"
                value={confirmPasscode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setConfirmPasscode(val);
                  setErrorMsg("");
                }}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-stone-950 border border-amber-500/60 text-amber-300 font-mono font-bold text-center text-base tracking-widest focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-200"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 pt-3 border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || savedSuccess || newPasscode.length !== 4}
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Update Passcode"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

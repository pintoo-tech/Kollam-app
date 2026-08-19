import React, { useState, useEffect } from "react";
import { Member, CurrentUser } from "../types";
import { LogoEmblem } from "./LogoEmblem";
import {
  LogIn,
  X,
  Shield,
  Phone,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Users,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

interface MemberLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  onLoginSuccess: (user: CurrentUser) => void;
  onOpenRegisterModal: () => void;
  onOpenAdminLogin?: () => void;
  adminPasscode?: string;
}

export const MemberLoginModal: React.FC<MemberLoginModalProps> = ({
  isOpen,
  onClose,
  members,
  onLoginSuccess,
  onOpenRegisterModal,
  onOpenAdminLogin,
  adminPasscode = "2026",
}) => {
  // Tabs: 'member' | 'admin'
  const [authMode, setAuthMode] = useState<"member" | "admin">("member");

  // Member Login Inputs
  const [phoneInput, setPhoneInput] = useState("");
  const [passcodeInput, setPasscodeInput] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);

  // Admin Login Inputs
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Clear password and passcode fields blank every time the modal is opened or mode switched
  useEffect(() => {
    if (isOpen) {
      setPasscodeInput("");
      setAdminPassword("");
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [isOpen, authMode]);

  const handleClose = () => {
    setPasscodeInput("");
    setAdminPassword("");
    setErrorMsg("");
    setSuccessMsg("");
    onClose();
  };

  if (!isOpen) return null;

  const handleMemberLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const phoneClean = phoneInput.trim().replace(/\D/g, "");
    const passcodeTrimmed = passcodeInput.trim();

    if (!phoneClean) {
      setErrorMsg("Please enter your registered Phone Number.");
      return;
    }

    if (!passcodeTrimmed) {
      setErrorMsg("Please enter your passcode or password.");
      return;
    }

    // Match phone number with registered member
    const matchedMember = members.find((m) => {
      const memPhone = m.phone.replace(/\D/g, "");
      return (
        (phoneClean.length >= 6 && memPhone.includes(phoneClean)) ||
        (phoneClean.length >= 10 && phoneClean.slice(-10) === memPhone.slice(-10))
      );
    });

    if (!matchedMember) {
      setErrorMsg(
        "No registered member found with this phone number. Please check your number or register as a new member."
      );
      return;
    }

    // Validate passcode: check member's specific passcode (default: 1234)
    const memberCustomPassword = matchedMember.password?.trim() || "1234";
    const isValidPasscode =
      passcodeTrimmed === memberCustomPassword ||
      (passcodeTrimmed === "1234" && !matchedMember.hasChangedPasscode);

    if (!isValidPasscode) {
      setErrorMsg("Invalid 4-digit passcode. Initial passcode for all members is 1234. Please check or contact the admin.");
      return;
    }

    setSuccessMsg(`Welcome, ${matchedMember.name}!`);
    setTimeout(() => {
      onLoginSuccess({
        role: "member",
        member: matchedMember,
      });
      onClose();
    }, 400);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const inputPass = adminPassword.trim();
    if (!inputPass) {
      setErrorMsg("Please enter the Admin Passcode.");
      return;
    }

    const expectedPass = (adminPasscode || "2026").trim();
    if (inputPass !== expectedPass) {
      setErrorMsg("Incorrect admin passcode. Access denied.");
      return;
    }

    setSuccessMsg("Administrator authentication successful!");
    setTimeout(() => {
      onLoginSuccess({
        role: "admin",
        username: "Admin HQ",
      });
      onClose();
      if (onOpenAdminLogin) {
        onOpenAdminLogin();
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-amber-500/50 rounded-2xl max-w-md w-full p-6 text-stone-100 shadow-2xl relative space-y-5 my-8">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-700 transition-colors"
          aria-label="Close Login Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Emblem */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <LogoEmblem size="md" showRegistrationBadge={false} />
          </div>
          <div>
            <h2 className="text-lg font-black text-amber-100">
              Kollam Maratha Association
            </h2>
            <p className="text-xs text-stone-400">
              {authMode === "member"
                ? "Enter your phone number and 4 digit passcode."
                : "Enter authorized administrator credentials."}
            </p>
          </div>
        </div>

        {/* Tab Switcher: Members Login & Admin Login */}
        <div className="grid grid-cols-2 p-1 bg-stone-950 rounded-xl border border-stone-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthMode("member");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              authMode === "member"
                ? "bg-amber-500 text-stone-950 shadow-md font-black"
                : "text-stone-400 hover:text-amber-300"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Members Login</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode("admin");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              authMode === "admin"
                ? "bg-amber-500 text-stone-950 shadow-md font-black"
                : "text-stone-400 hover:text-amber-300"
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Admin Login</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-start gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Notification */}
        {successMsg && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-start gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. MEMBERS LOGIN FORM */}
        {authMode === "member" && (
          <form onSubmit={handleMemberLogin} className="space-y-4">
            {/* Phone Number Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-300 block">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  placeholder="Enter 10-digit mobile number"
                  value={phoneInput}
                  onChange={(e) => {
                    setPhoneInput(e.target.value);
                    setErrorMsg("");
                  }}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500 placeholder-stone-500 font-medium font-mono"
                />
              </div>
            </div>

            {/* 4 Digit Passcode Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-300 block">
                  4 Digit Passcode *
                </label>
                <span className="text-[10px] text-stone-400 font-mono">
                  Initial default: <strong className="text-amber-400">1234</strong>
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type={showPasscode ? "text" : "password"}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  maxLength={4}
                  placeholder="Enter 4-digit passcode (1234)"
                  value={passcodeInput}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setPasscodeInput(digitsOnly);
                    setErrorMsg("");
                  }}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500 placeholder-stone-500 font-bold font-mono tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-200"
                  tabIndex={-1}
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-stone-400">
                Only numbers (0-9) are allowed. You will be prompted to create your private passcode on first login.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Login as Member</span>
            </button>

            {/* Registration Prompt */}
            <div className="text-center pt-2 border-t border-stone-800">
              <p className="text-xs text-stone-400">
                Not registered yet?{" "}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenRegisterModal();
                  }}
                  className="text-amber-400 hover:text-amber-300 font-bold underline ml-1"
                >
                  Apply for Membership
                </button>
              </p>
            </div>
          </form>
        )}

        {/* 2. ADMIN LOGIN FORM */}
        {authMode === "admin" && (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
              <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-200">Administrator Access</p>
                <p className="text-[11px] text-stone-300 mt-0.5">
                  Enter your secure Administrator Passcode to access the Admin Control Panel.
                </p>
              </div>
            </div>

            {/* Admin Passcode Input Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-300 block">
                Admin Passcode *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type={showAdminPassword ? "text" : "password"}
                  required
                  placeholder="Enter administrator passcode"
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    setErrorMsg("");
                  }}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500 placeholder-stone-500 font-bold font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-200"
                  tabIndex={-1}
                >
                  {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-stone-400">
                Unauthorized access is strictly restricted. Only authorized association executives may log in.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <Shield className="w-4 h-4" />
              <span>Verify Passcode & Enter Admin Panel</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState } from "react";
import {
  Home,
  Users,
  CreditCard,
  Award,
  Calendar,
  Menu,
  X,
  Settings,
  Power,
  Coins,
  LogIn,
  LogOut,
  UserCheck,
  Shield,
  Cake,
  KeyRound,
  UserCog,
} from "lucide-react";
import { CurrentUser } from "../types";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenRegisterModal: () => void;
  onOpenIdCardModal: () => void;
  onOpenAdminPanel?: () => void;
  onCloseApp?: () => void;
  currentUser?: CurrentUser;
  onOpenLoginModal?: () => void;
  onLogout?: () => void;
  onChangePasscode?: () => void;
  onEditProfile?: () => void;
}

const DEFAULT_GUEST_USER: CurrentUser = { role: "guest" };

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenIdCardModal,
  onCloseApp,
  currentUser = DEFAULT_GUEST_USER,
  onOpenLoginModal,
  onLogout,
  onChangePasscode,
  onEditProfile,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "members", label: "Member Directory", icon: Users },
    { id: "gold-rates", label: "Live Gold Rates", icon: Coins },
    { id: "committee", label: "Committee Members", icon: Award },
    { id: "events", label: "Events & Gallery", icon: Calendar },
    { id: "admin", label: "Admin Panel", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md text-stone-100 shadow-xl border-b border-amber-600/30">
      {/* Top Bar: Menu Button on Left, Auth status & Close App on Right */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Left: Menu Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-stone-950/80 hover:bg-stone-800 border border-amber-500/40 text-amber-300 hover:text-amber-200 font-bold text-xs shadow-md transition-all focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {menuOpen ? (
              <X className="w-4 h-4 text-amber-400" />
            ) : (
              <Menu className="w-4 h-4 text-amber-400" />
            )}
            <span>Menu</span>
          </button>

          {/* Quick Active Tab indicator on mobile/desktop */}
          <span className="hidden sm:inline-block text-xs font-bold text-stone-400">
            •{" "}
            <span className="text-amber-200 capitalize">
              {navItems.find((n) => n.id === activeTab)?.label || activeTab}
            </span>
          </span>
        </div>

        {/* Right: User Login status / Login button & Close App Button */}
        <div className="flex items-center gap-2">
          {currentUser.role === "member" && currentUser.member ? (
            <div className="flex items-center gap-1.5 bg-stone-950/90 border border-emerald-500/40 rounded-xl px-2.5 sm:px-3 py-1.5 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-bold text-stone-200 truncate max-w-[90px] sm:max-w-[150px]">
                {currentUser.member.name}
              </span>
              {onEditProfile && (
                <button
                  type="button"
                  onClick={onEditProfile}
                  title="Edit your member profile & change picture"
                  className="ml-1 text-emerald-300 hover:text-emerald-100 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                >
                  <UserCog className="w-3 h-3 text-emerald-400" />
                  <span className="hidden sm:inline">Edit Profile</span>
                </button>
              )}
              {onChangePasscode && (
                <button
                  type="button"
                  onClick={onChangePasscode}
                  title="Change your 4-digit login passcode"
                  className="ml-1 text-amber-300 hover:text-amber-200 bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                >
                  <KeyRound className="w-3 h-3 text-amber-400" />
                  <span className="hidden sm:inline">Passcode</span>
                </button>
              )}
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  title="Logout"
                  className="ml-1 text-stone-400 hover:text-red-400 text-[10px] font-semibold flex items-center gap-0.5"
                >
                  <LogOut className="w-3 h-3" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              )}
            </div>
          ) : currentUser.role === "admin" ? (
            <div className="flex items-center gap-1.5 bg-stone-950/90 border border-amber-500/40 rounded-xl px-3 py-1.5 text-xs">
              <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-bold text-amber-300">Admin Mode</span>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  title="Logout Admin"
                  className="ml-1 text-stone-400 hover:text-red-400 text-[10px] font-semibold flex items-center gap-0.5"
                >
                  <LogOut className="w-3 h-3" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              )}
            </div>
          ) : (
            onOpenLoginModal && (
              <button
                type="button"
                onClick={onOpenLoginModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs shadow-sm transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )
          )}

          {/* Close App Button */}
          {onCloseApp && (
            <button
              onClick={onCloseApp}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 hover:text-red-100 font-bold text-xs transition-all shadow-md group shrink-0"
              title="Close Application"
              aria-label="Close Application"
            >
              <Power className="w-3.5 h-3.5 text-red-400 group-hover:text-red-200 transition-transform group-hover:scale-110" />
              <span className="hidden xs:inline sm:inline">Close App</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Menu Drawer / Dropdown */}
      {menuOpen && (
        <div className="bg-stone-950/95 border-t border-amber-600/30 px-4 py-3 shadow-2xl animate-in slide-in-from-top-2 duration-200 space-y-2">
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setMenuOpen(false);
                    setActiveTab(item.id);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-amber-500 text-stone-950 font-bold shadow-md"
                      : "bg-stone-900/80 text-stone-200 hover:bg-stone-800 hover:text-amber-300 border border-stone-800"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-stone-950" : "text-amber-400"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick links for logged-in member */}
          {currentUser.role === "member" && currentUser.member && (
            <div className="max-w-7xl mx-auto pt-2 border-t border-stone-800 flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs text-stone-400">
                Logged in as <strong className="text-amber-300">{currentUser.member.name}</strong> ({currentUser.member.memberId})
              </span>
              <div className="flex items-center gap-2">
                {onEditProfile && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onEditProfile();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <UserCog className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Edit Profile & Photo</span>
                  </button>
                )}
                {onChangePasscode && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onChangePasscode();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>Change Passcode</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};




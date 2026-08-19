import React, { useState, useRef, useEffect } from "react";
import { compressImageFile } from "../lib/imageCompressor";
import {
  AppNotification,
  AdvertisementSlide,
  Member,
  KollamTaluk,
  ExecutiveMember,
  GoldRates,
  GoldRatePromo,
  CurrentUser,
  AssociationEvent,
  GalleryItem,
} from "../types";
import {
  X,
  Home,
  Settings,
  Bell,
  UserCheck,
  Image,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  ShieldCheck,
  Users,
  Upload,
  Images,
  Check,
  Sparkles,
  Award,
  Search,
  ArrowUp,
  ArrowDown,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  Coins,
  FileSpreadsheet,
  Download,
  Link2,
  Cake,
  Calendar,
  Lock,
  Unlock,
  KeyRound,
  ShieldAlert,
  Eye,
  EyeOff,
  AlertCircle,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { BirthdayView } from "./BirthdayView";
import { AdminMembersManagementView } from "./AdminMembersManagementView";
import { AdminEventsGalleryManager } from "./AdminEventsGalleryManager";
import { LogoEmblem } from "./LogoEmblem";

interface AdminPanelModalProps {
  onClose: () => void;
  onGoHome?: () => void;
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  advertisements: AdvertisementSlide[];
  setAdvertisements: React.Dispatch<React.SetStateAction<AdvertisementSlide[]>>;
  pendingMembers: Member[];
  onApproveMember: (memberId: string) => void;
  onRejectMember: (memberId: string) => void;
  onUpdateMemberDetails?: (updatedMember: Member) => void;
  members: Member[];
  committee: ExecutiveMember[];
  setCommittee: React.Dispatch<React.SetStateAction<ExecutiveMember[]>>;
  onDeleteCommitteeMemberOnline?: (id: string, name?: string) => Promise<void>;
  events?: AssociationEvent[];
  setEvents?: React.Dispatch<React.SetStateAction<AssociationEvent[]>>;
  gallery?: GalleryItem[];
  setGallery?: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  onSaveEventOnline?: (event: AssociationEvent) => Promise<void>;
  onDeleteEventOnline?: (eventId: string) => Promise<void>;
  onSaveGalleryItemOnline?: (item: GalleryItem) => Promise<void>;
  onDeleteGalleryItemOnline?: (galleryId: string) => Promise<void>;
  goldRates?: GoldRates;
  setGoldRates?: React.Dispatch<React.SetStateAction<GoldRates>>;
  onSaveGoldRatesOnline?: (rates: GoldRates) => Promise<void>;
  goldPromos?: GoldRatePromo[];
  setGoldPromos?: React.Dispatch<React.SetStateAction<GoldRatePromo[]>>;
  onSaveGoldPromosOnline?: (promos: GoldRatePromo[]) => Promise<void>;
  currentUser?: CurrentUser;
  onUpdateMember?: (updatedMember: Member) => void;
  onDeleteMember?: (memberId: string) => void;
  onAddMemberDirectly?: (newMember: Member) => void;
  onAdminLoginSuccess?: (user: CurrentUser) => void;
  adminPasscode?: string;
  onSaveAdminPasscodeOnline?: (newPasscode: string) => Promise<void>;
  onAdminResetMemberPasscode?: (memberId: string, newPasscode: string) => Promise<void>;
}

const COMMON_DESIGNATIONS = [
  "District President",
  "Working President",
  "General Secretary",
  "District Treasurer",
  "Senior Vice President",
  "Vice President",
  "Joint Secretary",
  "Organizing Secretary",
  "Chief Patron",
  "Advisory Council Member",
  "Mahila Wing Convenor",
  "Youth Wing Convenor",
  "Taluk Unit Convenor",
  "Executive Committee Member",
];

interface ImageGallerySelectorProps {
  label: string;
  selectedImageUrl?: string;
  onSelectImage: (url: string) => void;
  onRemoveImage?: () => void;
  required?: boolean;
  hideDirectUrlInput?: boolean;
}

interface GoldRateDirectPhotoUploaderProps {
  label: string;
  slotNumber: number;
  promo: GoldRatePromo;
  onChangePromo: (updated: GoldRatePromo) => void;
}

const GoldRateDirectPhotoUploader: React.FC<GoldRateDirectPhotoUploaderProps> = ({
  label,
  slotNumber,
  promo,
  onChangePromo,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 1000, 1000, 0.8);
      onChangePromo({
        ...promo,
        imageUrl: compressedDataUrl,
      });
    } catch (err) {
      console.error("Error compressing gold promo image:", err);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          onChangePromo({
            ...promo,
            imageUrl: reader.result,
          });
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div className="space-y-3 p-4 rounded-xl bg-stone-950/90 border border-amber-500/30">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
          <Images className="w-4 h-4 text-amber-400" />
          <span>{label}</span>
        </span>
        <span className="text-[10px] text-stone-400 font-mono">Slide #{slotNumber}</span>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 4x6 Photo Preview */}
      {promo.imageUrl ? (
        <div className="relative rounded-xl overflow-hidden border-2 border-amber-500/50 bg-stone-900 aspect-[4/6] max-h-72 w-full mx-auto flex items-center justify-center group shadow-lg">
          <img
            src={promo.imageUrl}
            alt={`Gold rate promo #${slotNumber}`}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-[180px] py-2 px-3 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shadow hover:bg-amber-400 flex items-center justify-center gap-1.5 transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Change Photo</span>
            </button>
            <button
              type="button"
              onClick={() => onChangePromo({ ...promo, imageUrl: "" })}
              className="w-full max-w-[180px] py-2 px-3 rounded-xl bg-red-950 text-red-300 border border-red-500/40 font-bold text-xs hover:bg-red-900 flex items-center justify-center gap-1.5 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Photo</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-amber-500/40 hover:border-amber-400 rounded-xl p-8 text-center cursor-pointer bg-stone-900/50 hover:bg-stone-900 transition-all flex flex-col items-center justify-center gap-3 aspect-[4/6] max-h-72"
        >
          <div className="p-3 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Upload className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-amber-200">
              {isCompressing ? "Optimizing photo..." : "Upload 4×6 Photo"}
            </p>
            <p className="text-[11px] text-stone-400">
              Click to select photo from your device
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons under Preview */}
      {promo.imageUrl && (
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-amber-500/30 text-amber-300 font-bold text-xs transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Photo</span>
          </button>
          <button
            type="button"
            onClick={() => onChangePromo({ ...promo, imageUrl: "" })}
            className="p-1.5 rounded-xl bg-red-950/70 hover:bg-red-900 border border-red-500/30 text-red-400 hover:text-red-200 transition-all"
            title="Remove Photo"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Title / Caption */}
      <div className="space-y-1 pt-1">
        <label className="text-[11px] font-bold text-stone-300 block">
          Photo Title / Caption
        </label>
        <input
          type="text"
          placeholder="e.g. Royal Heritage Jewellery"
          value={promo.title || ""}
          onChange={(e) => onChangePromo({ ...promo, title: e.target.value })}
          className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500 font-medium"
        />
      </div>

      {/* Subtitle / Description */}
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-stone-300 block">
          Subtitle / Details
        </label>
        <input
          type="text"
          placeholder="e.g. Certified 916 Hallmark Jewellery Collections"
          value={promo.subtitle || ""}
          onChange={(e) => onChangePromo({ ...promo, subtitle: e.target.value })}
          className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500 font-medium"
        />
      </div>
    </div>
  );
};

const ImageGallerySelector: React.FC<ImageGallerySelectorProps> = ({
  label,
  selectedImageUrl,
  onSelectImage,
  onRemoveImage,
  required = false,
  hideDirectUrlInput = false,
}) => {
  const [customUrlInput, setCustomUrlInput] = useState(
    selectedImageUrl && !selectedImageUrl.startsWith("data:") ? selectedImageUrl : ""
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedImageUrl && !selectedImageUrl.startsWith("data:")) {
      setCustomUrlInput(selectedImageUrl);
    } else if (!selectedImageUrl) {
      setCustomUrlInput("");
    }
  }, [selectedImageUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedDataUrl = await compressImageFile(file, 1000, 1000, 0.8);
        onSelectImage(compressedDataUrl);
      } catch {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            onSelectImage(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleApplyCustomUrl = (val: string) => {
    setCustomUrlInput(val);
    if (val.trim()) {
      onSelectImage(val.trim());
    }
  };

  return (
    <div className="space-y-2.5 p-3 rounded-xl bg-stone-950/80 border border-stone-800">
      <div className="flex items-center justify-between">
        <label className="text-stone-300 font-semibold text-xs flex items-center gap-1.5">
          <Images className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {label} {required && "*"}
          </span>
        </label>
        {selectedImageUrl && onRemoveImage && (
          <button
            type="button"
            onClick={() => {
              setCustomUrlInput("");
              onRemoveImage();
            }}
            className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
          >
            <Trash2 className="w-3 h-3" />
            <span>Remove Image</span>
          </button>
        )}
      </div>

      {/* 1. DIRECT IMAGE LINK / URL INPUT (Hidden for ads as requested) */}
      {!hideDirectUrlInput && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-amber-300 font-bold flex items-center gap-1">
              <Link2 className="w-3 h-3 text-amber-400" />
              <span>Enter Direct Picture Link (URL):</span>
            </span>
            {customUrlInput && (
              <button
                type="button"
                onClick={() => {
                  setCustomUrlInput("");
                  if (onRemoveImage) onRemoveImage();
                }}
                className="text-stone-400 hover:text-stone-200 text-[10px]"
              >
                Clear Link
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Paste image link, e.g. https://... or /assets/photo.jpg"
              value={customUrlInput}
              onChange={(e) => handleApplyCustomUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
        </div>
      )}

      {/* Selected Image Preview */}
      {selectedImageUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-amber-500/50 bg-stone-900 h-36 flex items-center justify-center group">
          <img
            src={selectedImageUrl}
            alt="Selected preview"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs shadow hover:bg-amber-400 flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Different Photo</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 px-3 rounded-xl border border-dashed border-amber-600/50 hover:border-amber-400 bg-stone-900/80 hover:bg-stone-800 text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Upload className="w-4 h-4 text-amber-400" />
            <span>Select / Upload Photo from Device</span>
          </button>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  onClose,
  onGoHome,
  notifications,
  setNotifications,
  advertisements,
  setAdvertisements,
  pendingMembers,
  onApproveMember,
  onRejectMember,
  onUpdateMemberDetails,
  members,
  committee,
  setCommittee,
  onDeleteCommitteeMemberOnline,
  events = [],
  setEvents,
  gallery = [],
  setGallery,
  onSaveEventOnline,
  onDeleteEventOnline,
  onSaveGalleryItemOnline,
  onDeleteGalleryItemOnline,
  goldRates,
  setGoldRates,
  onSaveGoldRatesOnline,
  goldPromos,
  setGoldPromos,
  onSaveGoldPromosOnline,
  currentUser,
  onUpdateMember,
  onDeleteMember,
  onAddMemberDirectly,
  onAdminLoginSuccess,
  adminPasscode = "2026",
  onSaveAdminPasscodeOnline,
  onAdminResetMemberPasscode,
}) => {
  const [activeTab, setActiveTab] = useState<
    "notifs" | "approvals" | "members" | "committee" | "events_gallery" | "birthday" | "ads" | "gold_rates" | "security"
  >("notifs");

  // Passcode verification state: Strictly require admin passcode entry for all admin links
  const [localAdminAuthenticated, setLocalAdminAuthenticated] = useState(() => currentUser?.role === "admin");
  const [enteredPasscode, setEnteredPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [showPasscodeText, setShowPasscodeText] = useState(false);

  // Security Tab state: Changing admin passcode & resetting member passcodes
  const [currentAdminPasscode, setCurrentAdminPasscode] = useState(adminPasscode || "2026");
  const [adminNewPasscode, setAdminNewPasscode] = useState("");
  const [adminConfirmPasscode, setAdminConfirmPasscode] = useState("");
  const [adminPasscodeSavedMsg, setAdminPasscodeSavedMsg] = useState("");
  const [adminPasscodeErrorMsg, setAdminPasscodeErrorMsg] = useState("");
  const [showAdminPasscodeSecret, setShowAdminPasscodeSecret] = useState(false);
  const [memberSecuritySearch, setMemberSecuritySearch] = useState("");
  const [memberResetSuccessMsg, setMemberResetSuccessMsg] = useState("");
  const [memberCustomPinMap, setMemberCustomPinMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (adminPasscode) {
      setCurrentAdminPasscode(adminPasscode);
    }
  }, [adminPasscode]);

  useEffect(() => {
    if (currentUser?.role === "admin") {
      setLocalAdminAuthenticated(true);
    } else {
      setLocalAdminAuthenticated(false);
    }
  }, [currentUser?.role]);

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = enteredPasscode.trim();
    const activePass = (currentAdminPasscode || adminPasscode || "2026").trim();
    if (clean === activePass) {
      setLocalAdminAuthenticated(true);
      setPasscodeError("");
      if (onAdminLoginSuccess) {
        onAdminLoginSuccess({ role: "admin", username: "Admin HQ" });
      }
    } else {
      setPasscodeError("Incorrect passcode. Please enter the valid Admin Passcode.");
    }
  };

  const [isSavingAdminPasscode, setIsSavingAdminPasscode] = useState(false);
  const handleSaveNewAdminPasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminPasscodeErrorMsg("");
    setAdminPasscodeSavedMsg("");

    const p1 = adminNewPasscode.trim();
    const p2 = adminConfirmPasscode.trim();

    if (!p1 || p1.length < 4) {
      setAdminPasscodeErrorMsg("Admin passcode must be at least 4 characters.");
      return;
    }

    if (p1 !== p2) {
      setAdminPasscodeErrorMsg("New passcodes do not match. Please re-enter.");
      return;
    }

    setIsSavingAdminPasscode(true);
    try {
      setCurrentAdminPasscode(p1);
      if (onSaveAdminPasscodeOnline) {
        await onSaveAdminPasscodeOnline(p1);
      }
      setAdminPasscodeSavedMsg("Admin passcode has been updated successfully!");
      setAdminNewPasscode("");
      setAdminConfirmPasscode("");
      setTimeout(() => setAdminPasscodeSavedMsg(""), 4000);
    } catch (err) {
      console.error("Error saving admin passcode:", err);
      setAdminPasscodeErrorMsg("Could not save new admin passcode.");
    } finally {
      setIsSavingAdminPasscode(false);
    }
  };

  const handleQuickResetMemberPasscode = async (memberId: string, memberName: string, customPin?: string) => {
    const pinToSet = (customPin || memberCustomPinMap[memberId] || "1234").trim();
    try {
      if (onAdminResetMemberPasscode) {
        await onAdminResetMemberPasscode(memberId, pinToSet);
      } else if (onUpdateMember) {
        const target = members.find((m) => m.id === memberId || m.memberId === memberId);
        if (target) {
          onUpdateMember({ ...target, password: pinToSet, hasChangedPasscode: false });
        }
      }
      setMemberResetSuccessMsg(`Passcode for ${memberName} reset to "${pinToSet}"!`);
      setTimeout(() => setMemberResetSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Error resetting member passcode:", err);
    }
  };

  // Gold Rates Form State
  const [goldRatesForm, setGoldRatesForm] = useState<GoldRates>(
    goldRates || {
      rate22_1g: "6,740",
      rate22_8g: "53,920",
      rate999_1g: "7,350",
      silver999_1g: "98.50",
      lastUpdated: "Today, Live Market",
      updatedBy: "Admin",
    }
  );
  const [goldRatesSavedMsg, setGoldRatesSavedMsg] = useState(false);

  // 4x6 Slideshow Pictures Form State for Gold Rate Page (2 Pictures)
  const getInitialSlot1 = (): GoldRatePromo => {
    try {
      const cached = localStorage.getItem("kollam_gold_promos_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed[0]) return parsed[0];
      }
    } catch {}
    return (
      (goldPromos && goldPromos[0]) || {
        id: "gold-promo-1",
        imageUrl:
          "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
        title: "Kollam Royal Heritage Jewellery",
        subtitle: "Exclusive 916 Hallmark Jewellery & Bullion Bar Collections",
      }
    );
  };

  const getInitialSlot2 = (): GoldRatePromo => {
    try {
      const cached = localStorage.getItem("kollam_gold_promos_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed[1]) return parsed[1];
      }
    } catch {}
    return (
      (goldPromos && goldPromos[1]) || {
        id: "gold-promo-2",
        imageUrl:
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
        title: "Pure Gold & Sovereign Showcase",
        subtitle: "Certified 22ct / 916 & 24ct Fine Gold at Best Daily Rates",
      }
    );
  };

  const [goldPromoSlot1, setGoldPromoSlot1] = useState<GoldRatePromo>(getInitialSlot1);
  const [goldPromoSlot2, setGoldPromoSlot2] = useState<GoldRatePromo>(getInitialSlot2);

  useEffect(() => {
    if (goldRates) {
      setGoldRatesForm(goldRates);
    }
  }, [goldRates]);

  useEffect(() => {
    if (goldPromos && goldPromos.length > 0) {
      if (goldPromos[0] && goldPromos[0].imageUrl) {
        setGoldPromoSlot1(goldPromos[0]);
      }
      if (goldPromos[1] && goldPromos[1].imageUrl) {
        setGoldPromoSlot2(goldPromos[1]);
      }
    }
  }, [goldPromos]);

  // Handle Export Members Data in CSV
  const handleExportMembersCSV = () => {
    if (!members || members.length === 0) return;

    const headers = [
      "Member ID",
      "Full Name",
      "Roll / Status",
      "Taluk / Unit",
      "House Name",
      "Address",
      "Phone Number",
      "Email",
      "Blood Group",
      "Occupation",
      "Marital Status",
      "Family Members Count",
      "Joining Year",
    ];

    const rows = members.map((m) => [
      `"${(m.memberId || "").replace(/"/g, '""')}"`,
      `"${(m.name || "").replace(/"/g, '""')}"`,
      `"${(m.status || "").replace(/"/g, '""')}"`,
      `"${(m.talukUnit || "").replace(/"/g, '""')}"`,
      `"${(m.houseName || "").replace(/"/g, '""')}"`,
      `"${(m.address || "").replace(/"/g, '""')}"`,
      `"${(m.phone || "").replace(/"/g, '""')}"`,
      `"${(m.email || "").replace(/"/g, '""')}"`,
      `"${(m.bloodGroup || "").replace(/"/g, '""')}"`,
      `"${(m.occupation || "").replace(/"/g, '""')}"`,
      `"${(m.maritalStatus || "").replace(/"/g, '""')}"`,
      `"${m.familyMembersCount || ""}"`,
      `"${m.joiningYear || ""}"`,
    ]);

    const csvContent =
      "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Kollam_Maratha_Members_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Save Live Gold Rates & 4x6 Slideshow Pictures
  const [isSavingGoldRates, setIsSavingGoldRates] = useState(false);
  const handleSaveGoldRates = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGoldRates(true);
    try {
      const updatedRates: GoldRates = {
        ...goldRatesForm,
        lastUpdated: `Updated at ${new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}, ${new Date().toLocaleDateString()}`,
        updatedBy: "Admin HQ",
      };
      if (setGoldRates) {
        setGoldRates(updatedRates);
      }
      if (onSaveGoldRatesOnline) {
        await onSaveGoldRatesOnline(updatedRates);
      }

      const updatedPromos: GoldRatePromo[] = [
        {
          id: "gold-promo-1",
          imageUrl: goldPromoSlot1.imageUrl,
          title: goldPromoSlot1.title || "Kollam Royal Heritage Jewellery",
          subtitle: goldPromoSlot1.subtitle || "",
        },
        {
          id: "gold-promo-2",
          imageUrl: goldPromoSlot2.imageUrl,
          title: goldPromoSlot2.title || "Pure Gold & Sovereign Showcase",
          subtitle: goldPromoSlot2.subtitle || "",
        },
      ];

      try {
        localStorage.setItem("kollam_gold_promos_cache", JSON.stringify(updatedPromos));
      } catch {}

      if (setGoldPromos) {
        setGoldPromos(updatedPromos);
      }
      if (onSaveGoldPromosOnline) {
        await onSaveGoldPromosOnline(updatedPromos);
      }

      setGoldRatesSavedMsg(true);
      setTimeout(() => setGoldRatesSavedMsg(false), 3000);
    } catch (err) {
      console.error("Error saving gold rates:", err);
    } finally {
      setIsSavingGoldRates(false);
    }
  };

  // Two Notifications Form State (Direct image selection from gallery, separate title, details, date)
  const [notifSlot1, setNotifSlot1] = useState<AppNotification>(
    notifications[0] || {
      id: "notif-1",
      title: "Annual General Body Meeting & Cultural Fest 2026",
      message: "All registered members are cordially invited to attend the Annual General Body Meeting and Cultural Celebrations at District Maratha Bhavan Auditorium, Anandavalleswaram, Kollam.",
      imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
      date: new Date().toISOString().split("T")[0],
      active: true,
    }
  );

  const [notifSlot2, setNotifSlot2] = useState<AppNotification>(
    notifications[1] || {
      id: "notif-2",
      title: "Educational Merit Awards & Higher Studies Grant Applications",
      message: "Applications are invited from meritorious Maratha students residing in Kollam district for 2026 academic excellence awards and financial aid.",
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
      date: new Date().toISOString().split("T")[0],
      active: true,
    }
  );

  const [isSavingNotifs, setIsSavingNotifs] = useState(false);
  const [notifsSavedMsg, setNotifsSavedMsg] = useState(false);

  // Quick Add Notification Form State
  const [newNotifTitle, setNewNotifTitle] = useState("");
  const [newNotifMessage, setNewNotifMessage] = useState("");
  const [newNotifImage, setNewNotifImage] = useState("");

  // Advertisement editing form state with separate Title, Caption and Gallery Picture for both slides
  const [adSlot1, setAdSlot1] = useState<AdvertisementSlide>(
    advertisements[0] || {
      id: "ad-1",
      imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80",
      title: "Kollam Royal Heritage Jewellery & Silk Center",
      subtitle: "Special 10% privilege discount for all verified Kollam Maratha Association ID card holders.",
    }
  );

  const [adSlot2, setAdSlot2] = useState<AdvertisementSlide>(
    advertisements[1] || {
      id: "ad-2",
      imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
      title: "Anandavalleswaram Convention Center & Banquet Hall",
      subtitle: "Premium AC halls available for Maratha family weddings, receptions, and cultural meetings in Kollam.",
    }
  );

  const [isSavingAds, setIsSavingAds] = useState(false);
  const [adsSavedMsg, setAdsSavedMsg] = useState(false);

  // Committee State Management
  const [committeeList, setCommitteeList] = useState<ExecutiveMember[]>(committee || []);
  const [isSavingCommittee, setIsSavingCommittee] = useState(false);
  const [committeeSavedMsg, setCommitteeSavedMsg] = useState(false);
  const [isAppointModalOpen, setIsAppointModalOpen] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [selectedMemberForAppoint, setSelectedMemberForAppoint] = useState<Member | null>(null);
  
  const [appointDesignation, setAppointDesignation] = useState<string>("Executive Committee Member");
  const [appointCustomDesignation, setAppointCustomDesignation] = useState<string>("");
  const [appointPortfolio, setAppointPortfolio] = useState<string>("");
  const [appointPriority, setAppointPriority] = useState<number>(committeeList.length + 1);
  const [appointPhotoUrl, setAppointPhotoUrl] = useState<string>("");
  const [isSavingAppoint, setIsSavingAppoint] = useState(false);
  const [editingCommitteeMember, setEditingCommitteeMember] = useState<ExecutiveMember | null>(null);
  const [isSavingEditOfficial, setIsSavingEditOfficial] = useState(false);

  // Sync slots when incoming props update from real-time database
  useEffect(() => {
    if (notifications[0]) setNotifSlot1(notifications[0]);
    if (notifications[1]) setNotifSlot2(notifications[1]);
  }, [notifications]);

  useEffect(() => {
    if (advertisements[0]) setAdSlot1(advertisements[0]);
    if (advertisements[1]) setAdSlot2(advertisements[1]);
  }, [advertisements]);

  useEffect(() => {
    if (committee && committee.length > 0) {
      setCommitteeList(committee);
    }
  }, [committee]);

  // Editing pending member state
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Handle Save Two Notifications Directly
  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingNotifs(true);
    try {
      const updatedSlot1 = { ...notifSlot1, id: notifSlot1.id || "notif-1", active: true };
      const updatedSlot2 = { ...notifSlot2, id: notifSlot2.id || "notif-2", active: true };
      
      // Replace first 2 or set as notifications
      setNotifications((prev) => {
        const rest = prev.filter(
          (n) => n.id !== updatedSlot1.id && n.id !== updatedSlot2.id
        );
        return [updatedSlot1, updatedSlot2, ...rest];
      });

      setNotifsSavedMsg(true);
      setTimeout(() => setNotifsSavedMsg(false), 3000);
    } finally {
      setIsSavingNotifs(false);
    }
  };

  // Handle Add Single Custom Notification
  const handleAddNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotifTitle.trim()) return;

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: newNotifTitle,
      message: newNotifMessage,
      imageUrl: newNotifImage || undefined,
      date: new Date().toISOString().split("T")[0],
      active: true,
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setNewNotifTitle("");
    setNewNotifMessage("");
    setNewNotifImage("");
  };

  // Toggle Notification Active
  const handleToggleNotifActive = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, active: !n.active } : n))
    );
  };

  // Delete Notification
  const handleDeleteNotif = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Handle Save Advertisements
  const handleSaveAds = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAds(true);
    try {
      const updated1 = { ...adSlot1, id: adSlot1.id || "ad-1" };
      const updated2 = { ...adSlot2, id: adSlot2.id || "ad-2" };
      setAdvertisements([updated1, updated2]);
      setAdsSavedMsg(true);
      setTimeout(() => setAdsSavedMsg(false), 3000);
    } finally {
      setIsSavingAds(false);
    }
  };

  // Handle Update Member before approval
  const handleSaveMemberEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    if (onUpdateMemberDetails) {
      onUpdateMemberDetails(editingMember);
    }
    setEditingMember(null);
  };

  // COMMITTEE HANDLERS
  const handleSelectMemberToAppoint = (m: Member) => {
    setSelectedMemberForAppoint(m);
    setAppointPhotoUrl(m.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80");
    setAppointPriority(committeeList.length + 1);
  };

  const handleConfirmAppointMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberForAppoint) return;

    // Strict validation: Only approved active members can be appointed
    if (
      selectedMemberForAppoint.status === "Pending Approval" ||
      selectedMemberForAppoint.status === "Rejected"
    ) {
      alert("Only approved active members are eligible to be appointed to the Executive Committee.");
      return;
    }

    setIsSavingAppoint(true);
    try {
      const finalDesignation =
        appointDesignation === "Other (Custom Designation)"
          ? appointCustomDesignation.trim() || "Executive Member"
          : appointDesignation;

      const newCommitteeMember: ExecutiveMember = {
        id: `comm-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: selectedMemberForAppoint.name,
        designation: finalDesignation,
        role: finalDesignation,
        talukUnit: selectedMemberForAppoint.talukUnit,
        taluk: selectedMemberForAppoint.talukUnit,
        phone: selectedMemberForAppoint.phone,
        email: selectedMemberForAppoint.email || `${selectedMemberForAppoint.name.toLowerCase().replace(/\s+/g, ".")}@kollammaratha.org`,
        photoUrl: appointPhotoUrl || selectedMemberForAppoint.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        portfolio: finalDesignation,
        priority: Number(appointPriority) || committeeList.length + 1,
      };

      const updated = [...committeeList, newCommitteeMember].sort(
        (a, b) => (Number(a.priority) || 99) - (Number(b.priority) || 99)
      );

      setCommitteeList(updated);
      setCommittee(updated);
      setIsAppointModalOpen(false);
      setSelectedMemberForAppoint(null);
      setAppointPortfolio("");
      setAppointCustomDesignation("");
      setCommitteeSavedMsg(true);
      setTimeout(() => setCommitteeSavedMsg(false), 3000);
    } finally {
      setIsSavingAppoint(false);
    }
  };

  const handleDeleteCommitteeMember = async (id: string) => {
    const target = committeeList.find((c) => c.id === id);
    const updated = committeeList.filter((c) => c.id !== id);
    setCommitteeList(updated);
    setCommittee(updated);
    if (onDeleteCommitteeMemberOnline) {
      await onDeleteCommitteeMemberOnline(id, target?.name);
    }
    setCommitteeSavedMsg(true);
    setTimeout(() => setCommitteeSavedMsg(false), 3000);
  };

  const handleMoveCommitteeMember = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === committeeList.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const copy = [...committeeList];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    // update priority numbers
    const reordered = copy.map((item, idx) => ({
      ...item,
      priority: idx + 1,
    }));

    setCommitteeList(reordered);
    setCommittee(reordered);
  };

  const handleSaveEditedCommitteeMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCommitteeMember) return;

    setIsSavingEditOfficial(true);
    try {
      const updated = committeeList
        .map((c) => (c.id === editingCommitteeMember.id ? editingCommitteeMember : c))
        .sort((a, b) => (Number(a.priority) || 99) - (Number(b.priority) || 99));

      setCommitteeList(updated);
      setCommittee(updated);
      setEditingCommitteeMember(null);
      setCommitteeSavedMsg(true);
      setTimeout(() => setCommitteeSavedMsg(false), 3000);
    } finally {
      setIsSavingEditOfficial(false);
    }
  };

  // Filtered members for appointment search - STRICTLY ONLY APPROVED MEMBERS
  const filteredDirectoryMembers = members.filter((m) => {
    // Only approved active members are eligible to be appointed as Committee Member
    const isApproved =
      (m.status === "Active" || m.status === "Approved" || (!m.status && m.status !== "Pending Approval" && m.status !== "Rejected")) &&
      m.status !== "Pending Approval" &&
      m.status !== "Rejected";
    if (!isApproved) return false;

    if (!memberSearchQuery.trim()) return true;
    const q = memberSearchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      (m.houseName || "").toLowerCase().includes(q) ||
      (m.place || "").toLowerCase().includes(q) ||
      (m.placeMH || "").toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q) ||
      (m.talukUnit || "").toLowerCase().includes(q) ||
      m.phone.includes(q)
    );
  });

  // Passcode Lock Gate: If not authenticated, require admin passcode
  if (!localAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-8 bg-stone-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl space-y-6 animate-fadeIn">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="p-4 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-amber-100">Admin Control Panel</h2>
            <p className="text-xs text-stone-400">
              Please enter the administrator passcode to access management controls.
            </p>
          </div>
        </div>

        <form onSubmit={handleVerifyPasscode} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-300 block">
              Admin Passcode / Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type={showPasscodeText ? "text" : "password"}
                required
                autoFocus
                placeholder="Enter administrator passcode"
                value={enteredPasscode}
                onChange={(e) => {
                  setEnteredPasscode(e.target.value);
                  setPasscodeError("");
                }}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-mono text-sm focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowPasscodeText(!showPasscodeText)}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-200"
              >
                {showPasscodeText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passcodeError && (
              <p className="text-xs font-bold text-red-400 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{passcodeError}</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onGoHome || onClose}
              className="flex-1 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Home className="w-4 h-4 text-amber-400" />
              <span>Back to Home</span>
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5"
            >
              <Unlock className="w-4 h-4" />
              <span>Verify & Unlock</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 py-1">
      <div className="bg-stone-900 border border-amber-500/40 rounded-2xl p-4 sm:p-5 text-stone-100 shadow-2xl space-y-3.5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-100">Admin Control Panel</h2>
              <p className="text-xs text-stone-400">
                Manage notifications, member approvals, members directory, committee, birthdays, and live rates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* CSV Export Button */}
            <button
              onClick={handleExportMembersCSV}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs shadow-md transition-all"
              title="Download full member directory as CSV file"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV ({members.length})</span>
            </button>

            <button
              onClick={onGoHome || onClose}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all"
              title="Return to Home Page"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher: All tabs styled with uniform orange color theme */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-1.5 p-1.5 bg-stone-950 rounded-2xl border border-stone-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab("notifs")}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all text-xs ${
              activeTab === "notifs"
                ? "bg-amber-500 text-stone-950 shadow-md font-black"
                : "bg-stone-900/90 text-amber-300/90 hover:text-amber-200 hover:bg-amber-950/40 border border-amber-500/30"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Notification</span>
          </button>

          <button
            onClick={() => setActiveTab("approvals")}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all text-xs ${
              activeTab === "approvals"
                ? "bg-amber-500 text-stone-950 shadow-md font-black"
                : "bg-stone-900/90 text-amber-300/90 hover:text-amber-200 hover:bg-amber-950/40 border border-amber-500/30"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Approval ({pendingMembers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("members")}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all text-xs ${
              activeTab === "members"
                ? "bg-amber-500 text-stone-950 shadow-md font-black"
                : "bg-stone-900/90 text-amber-300/90 hover:text-amber-200 hover:bg-amber-950/40 border border-amber-500/30"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Members ({members.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("committee")}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all text-xs ${
              activeTab === "committee"
                ? "bg-amber-500 text-stone-950 shadow-md font-black"
                : "bg-stone-900/90 text-amber-300/90 hover:text-amber-200 hover:bg-amber-950/40 border border-amber-500/30"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Committee ({committeeList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("events_gallery")}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all text-xs ${
              activeTab === "events_gallery"
                ? "bg-amber-500 text-stone-950 shadow-md font-black"
                : "bg-stone-900/90 text-amber-300/90 hover:text-amber-200 hover:bg-amber-950/40 border border-amber-500/30"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Events & Gallery ({events.length + gallery.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("birthday")}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all text-xs ${
              activeTab === "birthday"
                ? "bg-amber-500 text-stone-950 shadow-md font-black"
                : "bg-stone-900/90 text-amber-300/90 hover:text-amber-200 hover:bg-amber-950/40 border border-amber-500/30"
            }`}
          >
            <Cake className="w-3.5 h-3.5" />
            <span>Birthday</span>
          </button>

          <button
            onClick={() => setActiveTab("ads")}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all text-xs ${
              activeTab === "ads"
                ? "bg-amber-500 text-stone-950 shadow-md font-black"
                : "bg-stone-900/90 text-amber-300/90 hover:text-amber-200 hover:bg-amber-950/40 border border-amber-500/30"
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>Advertisement</span>
          </button>

          <button
            onClick={() => setActiveTab("gold_rates")}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all text-xs ${
              activeTab === "gold_rates"
                ? "bg-amber-500 text-stone-950 shadow-md font-black"
                : "bg-stone-900/90 text-amber-300/90 hover:text-amber-200 hover:bg-amber-950/40 border border-amber-500/30"
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Gold Rates</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1 transition-all text-xs ${
              activeTab === "security"
                ? "bg-amber-500 text-stone-950 shadow-md font-black"
                : "bg-stone-900/90 text-amber-300/90 hover:text-amber-200 hover:bg-amber-950/40 border border-amber-500/30"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Passcode & Security</span>
          </button>
        </div>

        {/* TAB 1: NOTIFICATION SETTINGS (3 NOTIFICATIONS WITH PICTURE DIRECTLY) */}
        {activeTab === "notifs" && (
          <div className="space-y-6">
            <form onSubmit={handleSaveNotifications} className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Bell className="w-4 h-4" />
                  <span>Configure 3 Active Notifications with Picture (Direct Gallery Selection)</span>
                </h3>
                {notifsSavedMsg && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/40">
                    Notifications Saved Live!
                  </span>
                )}
              </div>

              {/* Notification 1 Form */}
              <div className="bg-stone-950 p-4 sm:p-5 rounded-xl border border-stone-800 space-y-4 text-xs">
                <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px] block border-b border-stone-800 pb-2">
                  Notification 1 (With Picture)
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="text-stone-300 font-semibold block mb-1">
                      Notification 1 Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Annual General Body Meeting & Cultural Fest"
                      value={notifSlot1.title}
                      onChange={(e) =>
                        setNotifSlot1({ ...notifSlot1, title: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-stone-300 font-semibold block mb-1">
                      Date
                    </label>
                    <input
                      type="text"
                      placeholder="YYYY-MM-DD"
                      value={notifSlot1.date}
                      onChange={(e) =>
                        setNotifSlot1({ ...notifSlot1, date: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-stone-300 font-semibold block mb-1">
                    Notice Message / Details *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Enter notification details..."
                    value={notifSlot1.message}
                    onChange={(e) =>
                      setNotifSlot1({ ...notifSlot1, message: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Direct Gallery Selection for Notification 1 */}
                <ImageGallerySelector
                  label="Notification 1 Picture (Select from Gallery)"
                  selectedImageUrl={notifSlot1.imageUrl}
                  onSelectImage={(url) =>
                    setNotifSlot1({ ...notifSlot1, imageUrl: url })
                  }
                  onRemoveImage={() =>
                    setNotifSlot1({ ...notifSlot1, imageUrl: undefined })
                  }
                  required
                />
              </div>

              {/* Notification 2 Form */}
              <div className="bg-stone-950 p-4 sm:p-5 rounded-xl border border-stone-800 space-y-4 text-xs">
                <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px] block border-b border-stone-800 pb-2">
                  Notification 2 (With Picture)
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="text-stone-300 font-semibold block mb-1">
                      Notification 2 Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Educational Merit Awards & Financial Grants"
                      value={notifSlot2.title}
                      onChange={(e) =>
                        setNotifSlot2({ ...notifSlot2, title: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-stone-300 font-semibold block mb-1">
                      Date
                    </label>
                    <input
                      type="text"
                      placeholder="YYYY-MM-DD"
                      value={notifSlot2.date}
                      onChange={(e) =>
                        setNotifSlot2({ ...notifSlot2, date: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-stone-300 font-semibold block mb-1">
                    Notice Message / Details *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Enter notification details..."
                    value={notifSlot2.message}
                    onChange={(e) =>
                      setNotifSlot2({ ...notifSlot2, message: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Direct Gallery Selection for Notification 2 */}
                <ImageGallerySelector
                  label="Notification 2 Picture (Select from Gallery)"
                  selectedImageUrl={notifSlot2.imageUrl}
                  onSelectImage={(url) =>
                    setNotifSlot2({ ...notifSlot2, imageUrl: url })
                  }
                  onRemoveImage={() =>
                    setNotifSlot2({ ...notifSlot2, imageUrl: undefined })
                  }
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={onGoHome || onClose}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs transition-colors"
                >
                  <Home className="w-4 h-4 text-amber-400" />
                  <span>Home</span>
                </button>
                <button
                  type="submit"
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-1.5 transition-all duration-300 ${
                    notifsSavedMsg
                      ? "bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-emerald-500/40"
                      : "bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/30"
                  }`}
                >
                  {notifsSavedMsg ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  <span>{notifsSavedMsg ? "Saved Live!" : "Save 2 Notifications Live"}</span>
                </button>
              </div>
            </form>

            {/* Quick Add Additional Notice Form */}
            <form onSubmit={handleAddNotification} className="bg-stone-950/70 p-4 rounded-xl border border-stone-800 space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>Add Additional Notice to Board</span>
              </h4>

              <div className="text-xs">
                <label className="text-stone-300 font-semibold block mb-1">
                  Notice Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Free Health Camp & Blood Donation Drive..."
                  value={newNotifTitle}
                  onChange={(e) => setNewNotifTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="text-xs">
                <label className="text-stone-300 font-semibold block mb-1">
                  Message Details *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Enter notice details..."
                  value={newNotifMessage}
                  onChange={(e) => setNewNotifMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <ImageGallerySelector
                label="Attach Picture (Select from Gallery)"
                selectedImageUrl={newNotifImage}
                onSelectImage={(url) => setNewNotifImage(url)}
                onRemoveImage={() => setNewNotifImage("")}
              />

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-xs rounded-lg border border-amber-600/30 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publish Additional Notice</span>
                </button>
              </div>
            </form>

            {/* List of All Notifications */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                All Published Notices ({notifications.length})
              </h3>
              {notifications.length === 0 ? (
                <p className="text-xs text-stone-500">No notifications published.</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex items-start justify-between gap-3 text-xs"
                  >
                    {n.imageUrl && (
                      <img
                        src={n.imageUrl}
                        alt=""
                        className="w-12 h-12 rounded object-cover border border-stone-700 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    )}

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-200">{n.title}</span>
                        <span className="text-[10px] text-stone-400 font-mono">{n.date}</span>
                      </div>
                      <p className="text-stone-300 text-[11px] line-clamp-2">{n.message}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleNotifActive(n.id)}
                        className={`px-2 py-1 rounded text-[10px] font-bold ${
                          n.active
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40"
                            : "bg-stone-800 text-stone-400"
                        }`}
                      >
                        {n.active ? "Active" : "Hidden"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteNotif(n.id)}
                        className="p-1.5 rounded bg-red-950/60 text-red-400 hover:bg-red-900 border border-red-600/30"
                        title="Delete Notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MEMBERS APPROVAL */}
        {activeTab === "approvals" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>Pending Member Registrations ({pendingMembers.length})</span>
              </h3>

              <button
                type="button"
                onClick={handleExportMembersCSV}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs shadow flex items-center gap-1.5 transition-all self-start sm:self-auto"
                title="Export approved members list to CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export Members Data in CSV ({members.length})</span>
              </button>
            </div>

            {pendingMembers.length === 0 ? (
              <div className="p-8 text-center bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs text-stone-300 font-semibold">
                  All pending member registrations have been processed!
                </p>
                <p className="text-[11px] text-stone-500">
                  New registrations submitted through the online form will appear here for admin approval.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {pendingMembers.map((m) => (
                  <div
                    key={m.id}
                    className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-900 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-100 text-sm">{m.name}</span>
                        <span className="font-mono text-[10px] text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-600/30">
                          {m.memberId}
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {m.talukUnit}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-stone-300">
                      <div>
                        <span className="text-stone-500 block text-[10px]">Place / District (KL)</span>
                        <span className="font-medium">{m.place || "Kollam"}, {m.district || "Kollam"}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px]">Phone</span>
                        <span className="font-mono">{m.phone}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px]">DOB</span>
                        <span>{m.dob || "—"}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px]">Blood Group</span>
                        <span className="font-mono font-bold text-red-400">{m.bloodGroup || "Not Specified"}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-stone-400 space-y-0.5">
                      <div>
                        <span className="text-stone-500">Address (KL): </span>
                        {m.address}
                      </div>
                      {(m.placeMH || m.districtMH || m.addressMH) && (
                        <div>
                          <span className="text-amber-400/80">Address (MH): </span>
                          {[m.placeMH, m.districtMH, m.addressMH].filter(Boolean).join(", ")}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-900">
                      <button
                        onClick={() => setEditingMember(m)}
                        className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] font-semibold flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5 text-amber-400" />
                        <span>Edit Details</span>
                      </button>

                      <button
                        onClick={() => onRejectMember(m.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-600/40 text-[11px] font-semibold flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => onApproveMember(m.id)}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-[11px] font-bold shadow flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve Member</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Modal Sub-dialog to Edit Member Details */}
            {editingMember && (
              <div className="p-4 bg-stone-950 border border-amber-500/50 rounded-xl space-y-3 mt-3">
                <h4 className="font-bold text-amber-300 text-xs">Edit Member Information</h4>
                <form onSubmit={handleSaveMemberEdit} className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-stone-400 block mb-0.5">Name</label>
                    <input
                      type="text"
                      value={editingMember.name}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, name: e.target.value })
                      }
                      className="w-full px-2 py-1.5 rounded bg-stone-900 border border-stone-700 text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="text-stone-400 block mb-0.5">Phone</label>
                    <input
                      type="text"
                      value={editingMember.phone}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, phone: e.target.value })
                      }
                      className="w-full px-2 py-1.5 rounded bg-stone-900 border border-stone-700 text-stone-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-stone-400 block mb-0.5">Place (KL)</label>
                    <input
                      type="text"
                      value={editingMember.place || ""}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, place: e.target.value })
                      }
                      className="w-full px-2 py-1.5 rounded bg-stone-900 border border-stone-700 text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="text-stone-400 block mb-0.5">District (KL)</label>
                    <input
                      type="text"
                      value={editingMember.district || ""}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, district: e.target.value })
                      }
                      className="w-full px-2 py-1.5 rounded bg-stone-900 border border-stone-700 text-stone-100"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-stone-400 block mb-0.5">Address (KL)</label>
                    <input
                      type="text"
                      value={editingMember.address || ""}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, address: e.target.value })
                      }
                      className="w-full px-2 py-1.5 rounded bg-stone-900 border border-stone-700 text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="text-stone-400 block mb-0.5">Place (MH)</label>
                    <input
                      type="text"
                      value={editingMember.placeMH || ""}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, placeMH: e.target.value })
                      }
                      className="w-full px-2 py-1.5 rounded bg-stone-900 border border-stone-700 text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="text-stone-400 block mb-0.5">District (MH)</label>
                    <input
                      type="text"
                      value={editingMember.districtMH || ""}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, districtMH: e.target.value })
                      }
                      className="w-full px-2 py-1.5 rounded bg-stone-900 border border-stone-700 text-stone-100"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-stone-400 block mb-0.5">Address (MH)</label>
                    <input
                      type="text"
                      value={editingMember.addressMH || ""}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, addressMH: e.target.value })
                      }
                      className="w-full px-2 py-1.5 rounded bg-stone-900 border border-stone-700 text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="text-stone-400 block mb-0.5">Blood Group (Optional)</label>
                    <input
                      type="text"
                      value={editingMember.bloodGroup || ""}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, bloodGroup: e.target.value })
                      }
                      placeholder="e.g. O+, A+, B+"
                      className="w-full px-2 py-1.5 rounded bg-stone-900 border border-stone-700 text-stone-100 font-mono"
                    />
                  </div>

                  <div className="col-span-2 flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingMember(null)}
                      className="px-3 py-1 rounded bg-stone-800 text-stone-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1 rounded bg-amber-500 text-stone-950 font-bold"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EDIT ADVERTISEMENTS (SEPARATE TITLE, CAPTION, LINK & DIRECT GALLERY PICTURE) */}
        {activeTab === "ads" && (
          <form onSubmit={handleSaveAds} className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Image className="w-4 h-4" />
                <span>Configure 2 Advertisement Pictures (Direct Gallery Selection)</span>
              </h3>
              {adsSavedMsg && (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/40">
                  Advertisements Saved Live!
                </span>
              )}
            </div>

            {/* Slide 1 Form */}
            <div className="bg-stone-950 p-4 sm:p-5 rounded-xl border border-stone-800 space-y-4 text-xs">
              <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px] block border-b border-stone-800 pb-2">
                Advertisement Picture 1
              </span>

              <div>
                <label className="text-stone-300 font-semibold block mb-1">
                  Picture 1 Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kollam Royal Heritage Jewellery & Silk Center"
                  value={adSlot1.title || ""}
                  onChange={(e) =>
                    setAdSlot1((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Picture 1 Caption */}
              <div>
                <label className="text-stone-300 font-semibold block mb-1">
                  Picture 1 Caption *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Enter caption for Picture 1 (e.g. Special privilege discount for Maratha association members...)"
                  value={adSlot1.subtitle || ""}
                  onChange={(e) =>
                    setAdSlot1((prev) => ({ ...prev, subtitle: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Picture 1 Link URL */}
              <div>
                <label className="text-stone-300 font-semibold block mb-1">
                  Picture 1 Link URL <span className="text-stone-400 font-normal">(Optional - opens when user clicks photo)</span>
                </label>
                <input
                  type="url"
                  placeholder="e.g. https://www.example.com or https://wa.me/919447000000"
                  value={adSlot1.linkUrl || ""}
                  onChange={(e) =>
                    setAdSlot1((prev) => ({ ...prev, linkUrl: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              {/* Direct Gallery Selection for Ad 1 */}
              <ImageGallerySelector
                label="Picture 1 Image (Select Directly from Gallery)"
                selectedImageUrl={adSlot1.imageUrl}
                onSelectImage={(url) =>
                  setAdSlot1((prev) => ({ ...prev, imageUrl: url }))
                }
                hideDirectUrlInput={true}
                required
              />
            </div>

            {/* Slide 2 Form */}
            <div className="bg-stone-950 p-4 sm:p-5 rounded-xl border border-stone-800 space-y-4 text-xs">
              <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px] block border-b border-stone-800 pb-2">
                Advertisement Picture 2
              </span>

              <div>
                <label className="text-stone-300 font-semibold block mb-1">
                  Picture 2 Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anandavalleswaram Convention Center & Banquet Hall"
                  value={adSlot2.title || ""}
                  onChange={(e) =>
                    setAdSlot2((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-stone-300 font-semibold block mb-1">
                  Picture 2 Caption *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Enter caption for Picture 2 (e.g. Premium AC halls available for Maratha family events...)"
                  value={adSlot2.subtitle || ""}
                  onChange={(e) =>
                    setAdSlot2((prev) => ({ ...prev, subtitle: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Picture 2 Link URL */}
              <div>
                <label className="text-stone-300 font-semibold block mb-1">
                  Picture 2 Link URL <span className="text-stone-400 font-normal">(Optional - opens when user clicks photo)</span>
                </label>
                <input
                  type="url"
                  placeholder="e.g. https://www.example.com or https://wa.me/919447000000"
                  value={adSlot2.linkUrl || ""}
                  onChange={(e) =>
                    setAdSlot2((prev) => ({ ...prev, linkUrl: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              {/* Direct Gallery Selection for Ad 2 */}
              <ImageGallerySelector
                label="Picture 2 Image (Select Directly from Gallery)"
                selectedImageUrl={adSlot2.imageUrl}
                onSelectImage={(url) =>
                  setAdSlot2((prev) => ({ ...prev, imageUrl: url }))
                }
                hideDirectUrlInput={true}
                required
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-800">
              <button
                type="button"
                onClick={onGoHome || onClose}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs transition-colors"
              >
                <Home className="w-4 h-4 text-amber-400" />
                <span>Home</span>
              </button>
              <button
                type="submit"
                className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-1.5 transition-all duration-300 ${
                  adsSavedMsg
                    ? "bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-emerald-500/40"
                    : "bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/30"
                }`}
              >
                {adsSavedMsg ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{adsSavedMsg ? "Saved Live!" : "Save Advertisement Settings"}</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: COMMITTEE MEMBERS SELECTION FROM DIRECTORY */}
        {activeTab === "committee" && (
          <div className="space-y-6">
            {/* Header & Appoint Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-950 p-4 rounded-xl border border-stone-800">
              <div>
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Select Committee Members from Members Directory</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Appoint registered members as Executive Committee officials and manage their designations live.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {committeeSavedMsg && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-full border border-emerald-500/40 animate-pulse">
                    Committee Saved Live!
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsAppointModalOpen(true);
                    setSelectedMemberForAppoint(null);
                    setMemberSearchQuery("");
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Appoint from Directory</span>
                </button>
              </div>
            </div>

            {/* Current Committee Members List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-400 px-1 font-semibold">
                <span>Current Executive Committee ({committeeList.length} Officials)</span>
                <span>Sorted by Order / Priority</span>
              </div>

              {committeeList.length === 0 ? (
                <div className="p-8 text-center bg-stone-950 rounded-xl border border-stone-800 text-stone-400 text-xs">
                  No committee members found. Click "+ Appoint from Directory" to add officials.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {committeeList.map((official, idx) => (
                    <div
                      key={official.id || idx}
                      className="bg-stone-950 p-4 rounded-xl border border-stone-800/80 hover:border-amber-500/40 transition-all flex flex-col justify-between gap-3 shadow-md"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={official.photoUrl}
                            alt={official.name}
                            className="w-14 h-14 rounded-xl object-cover border border-amber-500/30"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
                            }}
                          />
                          <span className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-black text-[10px] flex items-center justify-center shadow">
                            #{official.priority || idx + 1}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 font-bold text-[11px] border border-amber-500/30">
                              {official.role}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-stone-100 truncate mt-1">
                            {official.name}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-0.5">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-amber-500/70" />
                              {official.taluk}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-amber-500/70" />
                              {official.phone}
                            </span>
                          </div>
                          {official.portfolio && (
                            <p className="text-[11px] text-amber-200/70 mt-1 line-clamp-1 italic">
                              Portfolio: {official.portfolio}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Item Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-stone-800/80 text-xs">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveCommitteeMember(idx, "up")}
                            title="Move Up in Priority"
                            className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 disabled:opacity-30 disabled:cursor-not-allowed border border-stone-800"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === committeeList.length - 1}
                            onClick={() => handleMoveCommitteeMember(idx, "down")}
                            title="Move Down in Priority"
                            className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 disabled:opacity-30 disabled:cursor-not-allowed border border-stone-800"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingCommitteeMember(official)}
                            className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-semibold text-[11px]"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCommitteeMember(official.id)}
                            className="px-2.5 py-1 rounded-lg bg-red-950/70 hover:bg-red-900 text-red-300 hover:text-red-100 border border-red-700/50 flex items-center gap-1 font-semibold text-[11px] transition-colors shadow-sm"
                            title={`Remove ${official.name} from Committee`}
                          >
                            <Trash2 className="w-3 h-3 text-red-400" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={onGoHome || onClose}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs transition-colors"
              >
                <Home className="w-4 h-4 text-amber-400" />
                <span>Home</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCommittee(committeeList);
                  setCommitteeSavedMsg(true);
                  setTimeout(() => setCommitteeSavedMsg(false), 3000);
                }}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-1.5 transition-all duration-300 ${
                  committeeSavedMsg
                    ? "bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-emerald-500/40"
                    : "bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/30"
                }`}
              >
                {committeeSavedMsg ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{committeeSavedMsg ? "Saved Live!" : "Save All Committee Live"}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: LIVE GOLD RATES EDITOR */}
        {activeTab === "gold_rates" && (
          <div className="space-y-6">
            <form onSubmit={handleSaveGoldRates} className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Coins className="w-4 h-4" />
                  <span>Live Bullion & Gold Rates Editor</span>
                </h3>
                {goldRatesSavedMsg && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/40">
                    Live Gold Rates Updated!
                  </span>
                )}
              </div>

              <div className="bg-stone-950 p-4 sm:p-5 rounded-2xl border border-stone-800 space-y-3.5">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                  <div>
                    <h4 className="text-sm font-bold text-amber-200">Daily Gold & Silver Market Prices</h4>
                    <p className="text-xs text-stone-400">
                      Enter the rates in the blanks below. Values update immediately across the portal.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[11px] font-bold text-emerald-400">Live Sync</span>
                  </div>
                </div>

                {/* Several Boxes for the Rates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Box 1: 22ct/916: ( blank)/gm */}
                  <div className="p-3 rounded-xl bg-stone-900/90 border border-amber-500/40 space-y-1.5">
                    <label className="text-xs font-bold text-amber-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        <span>22ct / 916 Hallmark (1 Gram)</span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">₹ / gm</span>
                    </label>
                    <div className="flex items-center gap-2 bg-stone-950 p-2 rounded-xl border border-stone-700 focus-within:border-amber-500">
                      <span className="text-xs font-extrabold text-amber-400 font-mono shrink-0">
                        22ct/916: ₹
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="6,740"
                        value={goldRatesForm.rate22_1g}
                        onChange={(e) => {
                          const val = e.target.value;
                          setGoldRatesForm((prev) => {
                            const num1g = parseFloat(val.replace(/,/g, "")) || 0;
                            return {
                              ...prev,
                              rate22_1g: val,
                              rate22_8g: num1g > 0 ? (num1g * 8).toLocaleString("en-IN") : prev.rate22_8g,
                            };
                          });
                        }}
                        className="w-full bg-transparent text-stone-100 text-sm font-mono font-bold focus:outline-none"
                      />
                      <span className="text-xs font-bold text-stone-400 shrink-0">/gm</span>
                    </div>
                  </div>

                  {/* Box 2: 22ct/916: ( blank)/8gm */}
                  <div className="p-3 rounded-xl bg-stone-900/90 border border-amber-500/40 space-y-1.5">
                    <label className="text-xs font-bold text-amber-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        <span>22ct / 916 Sovereign (8 Grams / Pavan)</span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">₹ / 8gm</span>
                    </label>
                    <div className="flex items-center gap-2 bg-stone-950 p-2 rounded-xl border border-stone-700 focus-within:border-amber-500">
                      <span className="text-xs font-extrabold text-amber-400 font-mono shrink-0">
                        22ct/916: ₹
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="53,920"
                        value={goldRatesForm.rate22_8g}
                        onChange={(e) =>
                          setGoldRatesForm({ ...goldRatesForm, rate22_8g: e.target.value })
                        }
                        className="w-full bg-transparent text-stone-100 text-sm font-mono font-bold focus:outline-none"
                      />
                      <span className="text-xs font-bold text-stone-400 shrink-0">/8gm</span>
                    </div>
                  </div>

                  {/* Box 3: Fine 999: ( blank)/gm */}
                  <div className="p-3 rounded-xl bg-stone-900/90 border border-amber-500/40 space-y-1.5">
                    <label className="text-xs font-bold text-amber-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        <span>Fine 999 (24 Karat Pure Gold)</span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">₹ / gm</span>
                    </label>
                    <div className="flex items-center gap-2 bg-stone-950 p-2 rounded-xl border border-stone-700 focus-within:border-amber-500">
                      <span className="text-xs font-extrabold text-amber-400 font-mono shrink-0">
                        Fine 999: ₹
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="7,350"
                        value={goldRatesForm.rate999_1g}
                        onChange={(e) =>
                          setGoldRatesForm({ ...goldRatesForm, rate999_1g: e.target.value })
                        }
                        className="w-full bg-transparent text-stone-100 text-sm font-mono font-bold focus:outline-none"
                      />
                      <span className="text-xs font-bold text-stone-400 shrink-0">/gm</span>
                    </div>
                  </div>

                  {/* Box 4: Silver 999: ( blank)/gm */}
                  <div className="p-3 rounded-xl bg-stone-900/90 border border-stone-700 space-y-1.5">
                    <label className="text-xs font-bold text-stone-200 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-stone-300" />
                        <span>Silver 999 (Fine Pure Silver)</span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">₹ / gm</span>
                    </label>
                    <div className="flex items-center gap-2 bg-stone-950 p-2 rounded-xl border border-stone-700 focus-within:border-amber-500">
                      <span className="text-xs font-extrabold text-stone-300 font-mono shrink-0">
                        Silver 999: ₹
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="98.50"
                        value={goldRatesForm.silver999_1g}
                        onChange={(e) =>
                          setGoldRatesForm({ ...goldRatesForm, silver999_1g: e.target.value })
                        }
                        className="w-full bg-transparent text-stone-100 text-sm font-mono font-bold focus:outline-none"
                      />
                      <span className="text-xs font-bold text-stone-400 shrink-0">/gm</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: 4x6 SLIDESHOW PICTURES (2 PICTURES WITH DIFFUSION EFFECT) */}
              <div className="bg-stone-950 p-4 sm:p-5 rounded-2xl border border-stone-800 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                  <div>
                    <h4 className="text-sm font-bold text-amber-200 flex items-center gap-2">
                      <Images className="w-4 h-4 text-amber-400" />
                      <span>Gold Rate Page 4×6 Slideshow Pictures (2 Pictures)</span>
                    </h4>
                    <p className="text-xs text-stone-400">
                      Select or upload the 2 full pictures displayed in the 4×6 slideshow under the gold rates.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-500/30">
                    4×6 Aspect Ratio
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Picture Slot 1 */}
                  <GoldRateDirectPhotoUploader
                    label="Picture Slot 1"
                    slotNumber={1}
                    promo={goldPromoSlot1}
                    onChangePromo={(updated) => setGoldPromoSlot1(updated)}
                  />

                  {/* Picture Slot 2 */}
                  <GoldRateDirectPhotoUploader
                    label="Picture Slot 2"
                    slotNumber={2}
                    promo={goldPromoSlot2}
                    onChangePromo={(updated) => setGoldPromoSlot2(updated)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onGoHome || onClose}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs transition-colors"
                >
                  <Home className="w-4 h-4 text-amber-400" />
                  <span>Home</span>
                </button>

                <button
                  type="submit"
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all duration-300 ${
                    goldRatesSavedMsg
                      ? "bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-emerald-500/40"
                      : "bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/30"
                  }`}
                >
                  {goldRatesSavedMsg ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  <span>{goldRatesSavedMsg ? "Saved Live!" : "Save Rates & 4×6 Pictures Live"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB: EVENTS & GALLERY MANAGEMENT */}
        {activeTab === "events_gallery" && (
          <AdminEventsGalleryManager
            events={events}
            setEvents={setEvents || (() => {})}
            gallery={gallery}
            setGallery={setGallery || (() => {})}
            onSaveEventOnline={onSaveEventOnline}
            onDeleteEventOnline={onDeleteEventOnline}
            onSaveGalleryItemOnline={onSaveGalleryItemOnline}
            onDeleteGalleryItemOnline={onDeleteGalleryItemOnline}
          />
        )}

        {/* TAB 6: MEMBERS DIRECTORY MANAGEMENT (EDIT & DELETE ANY MEMBER) */}
        {activeTab === "members" && (
          <AdminMembersManagementView
            members={members}
            onUpdateMember={onUpdateMember || ((m) => {})}
            onDeleteMember={onDeleteMember || ((id) => {})}
            onAddMember={onAddMemberDirectly}
          />
        )}

        {/* TAB 7: BIRTHDAY AUTOMATION & CELEBRATION */}
        {activeTab === "birthday" && (
          <BirthdayView members={members} />
        )}

        {/* TAB 8: ADMIN PASSCODE & MEMBER SECURITY SETTINGS */}
        {activeTab === "security" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <KeyRound className="w-4 h-4" />
                  <span>Passcode & Security Management</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Change the Master Admin Passcode and reset passcodes for registered members.
                </p>
              </div>
            </div>

            {/* SECTION 1: CHANGE MASTER ADMIN PASSCODE */}
            <div className="bg-stone-950 p-5 rounded-2xl border border-amber-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-100">
                      Master Admin Passcode
                    </h4>
                    <p className="text-xs text-stone-400">
                      Used to authenticate and access the Admin Control Panel across all devices.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400 font-mono">
                    Current: {showAdminPasscodeSecret ? currentAdminPasscode : "••••••"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAdminPasscodeSecret(!showAdminPasscodeSecret)}
                    className="p-1.5 rounded-lg bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800"
                    title={showAdminPasscodeSecret ? "Hide passcode" : "Show passcode"}
                  >
                    {showAdminPasscodeSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {adminPasscodeSavedMsg && (
                <div className="p-3 bg-emerald-950/90 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{adminPasscodeSavedMsg}</span>
                </div>
              )}

              {adminPasscodeErrorMsg && (
                <div className="p-3 bg-red-950/90 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{adminPasscodeErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveNewAdminPasscode} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-stone-300 font-bold block mb-1">
                      New Admin Passcode *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter new admin passcode (min 4 chars)"
                      value={adminNewPasscode}
                      onChange={(e) => {
                        setAdminNewPasscode(e.target.value);
                        setAdminPasscodeErrorMsg("");
                      }}
                      className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-amber-300 font-mono font-bold text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-stone-300 font-bold block mb-1">
                      Confirm New Admin Passcode *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Re-enter new admin passcode"
                      value={adminConfirmPasscode}
                      onChange={(e) => {
                        setAdminConfirmPasscode(e.target.value);
                        setAdminPasscodeErrorMsg("");
                      }}
                      className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-amber-300 font-mono font-bold text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-stone-400">
                    💡 Tip: Changes are immediately synced to cloud Firestore and local device memory.
                  </span>

                  <button
                    type="submit"
                    disabled={!adminNewPasscode.trim() || !adminConfirmPasscode.trim()}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs shadow-lg transition-all flex items-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Save New Admin Passcode</span>
                  </button>
                </div>
              </form>
            </div>

            {/* SECTION 2: MEMBER PASSCODE RESET PORTAL */}
            <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-stone-900 text-amber-400 border border-stone-800">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-100">
                      Member Passcode Reset Portal
                    </h4>
                    <p className="text-xs text-stone-400">
                      Quickly reset member login passcodes to default (1234) or configure custom PINs.
                    </p>
                  </div>
                </div>

                {/* Member Search input */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search member name, ID, phone..."
                    value={memberSecuritySearch}
                    onChange={(e) => setMemberSecuritySearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {memberResetSuccessMsg && (
                <div className="p-3 bg-emerald-950/90 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{memberResetSuccessMsg}</span>
                </div>
              )}

              {/* Members List for Reset */}
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {members
                  .filter((m) => {
                    if (!memberSecuritySearch.trim()) return true;
                    const q = memberSecuritySearch.toLowerCase();
                    return (
                      m.name.toLowerCase().includes(q) ||
                      m.id.toLowerCase().includes(q) ||
                      m.memberId.toLowerCase().includes(q) ||
                      m.phone.includes(q) ||
                      (m.talukUnit || "").toLowerCase().includes(q)
                    );
                  })
                  .slice(0, 30)
                  .map((mem) => {
                    const customPin = memberCustomPinMap[mem.id] || "";
                    return (
                      <div
                        key={mem.id}
                        className="p-3 bg-stone-900/80 rounded-xl border border-stone-800/80 hover:border-amber-500/30 flex items-center justify-between gap-3 flex-wrap transition-all text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={
                              mem.avatarUrl ||
                              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                            }
                            alt={mem.name}
                            className="w-10 h-10 rounded-lg object-cover border border-stone-700 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-stone-100 truncate">{mem.name}</span>
                              <span className="font-mono text-[10px] text-amber-300 bg-black/60 px-1.5 py-0.2 rounded border border-amber-500/20">
                                {mem.memberId}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-stone-400">
                              <span>Tel: <strong className="font-mono text-stone-300">{mem.phone}</strong></span>
                              <span>•</span>
                              <span>{mem.talukUnit || "Kollam"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Reset controls */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleQuickResetMemberPasscode(mem.id, mem.name, "1234")}
                            className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-[11px] border border-amber-500/30 flex items-center gap-1 transition-all"
                            title="Reset to default 1234"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset to "1234"</span>
                          </button>

                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              inputMode="numeric"
                              maxLength={4}
                              placeholder="PIN"
                              value={customPin}
                              onChange={(e) => {
                                const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                                setMemberCustomPinMap((prev) => ({ ...prev, [mem.id]: v }));
                              }}
                              className="w-16 px-2 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-amber-300 font-mono text-center font-bold text-xs focus:outline-none focus:border-amber-500"
                            />
                            <button
                              type="button"
                              disabled={customPin.length !== 4}
                              onClick={() => handleQuickResetMemberPasscode(mem.id, mem.name, customPin)}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-bold text-[11px] transition-all"
                            >
                              Set PIN
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* MODAL 1: APPOINT MEMBER FROM DIRECTORY */}
        {isAppointModalOpen && (
          <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-stone-900 border border-amber-500/50 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-5 my-6 text-stone-100 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <UserPlus className="w-4 h-4" />
                  <span>Appoint Committee Member from Registry</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsAppointModalOpen(false);
                    setSelectedMemberForAppoint(null);
                  }}
                  className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-stone-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* STEP 1: Select Member from Directory */}
              {!selectedMemberForAppoint ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">
                      Step 1: Choose Member from Directory ({filteredDirectoryMembers.length} Available)
                    </label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search by member name, house name, taluk, phone or ID..."
                        value={memberSearchQuery}
                        onChange={(e) => setMemberSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {filteredDirectoryMembers.length === 0 ? (
                      <div className="p-6 text-center text-xs text-stone-400 bg-stone-950 rounded-xl border border-stone-800">
                        No members matching "{memberSearchQuery}".
                      </div>
                    ) : (
                      filteredDirectoryMembers.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => handleSelectMemberToAppoint(m)}
                          className="p-3 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-500/60 hover:bg-stone-900 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={m.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                              alt={m.name}
                              className="w-10 h-10 rounded-full object-cover border border-stone-700 group-hover:border-amber-500"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h5 className="text-xs font-bold text-stone-100 group-hover:text-amber-300 truncate">
                                  {m.name}
                                </h5>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-800 text-stone-400">
                                  {m.id}
                                </span>
                              </div>
                              <p className="text-[11px] text-stone-400 truncate">
                                {m.houseName} • {m.talukUnit}
                              </p>
                              <p className="text-[10px] text-stone-500">
                                Tel: {m.phone}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-500 group-hover:bg-amber-400 text-stone-950 font-bold text-xs"
                          >
                            Select & Appoint
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                /* STEP 2: Configure Designation & Responsibilities for Selected Member */
                <form onSubmit={handleConfirmAppointMember} className="space-y-4">
                  {/* Selected Member Header Card */}
                  <div className="p-3.5 rounded-xl bg-stone-950 border border-amber-500/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedMemberForAppoint.avatarUrl || appointPhotoUrl}
                        alt={selectedMemberForAppoint.name}
                        className="w-12 h-12 rounded-xl object-cover border border-amber-500/50"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                          Selected Member
                        </span>
                        <h4 className="text-sm font-bold text-stone-100">
                          {selectedMemberForAppoint.name}
                        </h4>
                        <p className="text-xs text-stone-400">
                          {selectedMemberForAppoint.talukUnit} • {selectedMemberForAppoint.phone}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedMemberForAppoint(null)}
                      className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
                    >
                      Change Member
                    </button>
                  </div>

                  {/* Form fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-stone-300 font-semibold block mb-1">
                        Executive Designation *
                      </label>
                      <select
                        value={appointDesignation}
                        onChange={(e) => setAppointDesignation(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                      >
                        {COMMON_DESIGNATIONS.map((des) => (
                          <option key={des} value={des}>
                            {des}
                          </option>
                        ))}
                        <option value="Other (Custom Designation)">
                          Other (Custom Designation)...
                        </option>
                      </select>
                    </div>

                    {appointDesignation === "Other (Custom Designation)" && (
                      <div>
                        <label className="text-stone-300 font-semibold block mb-1">
                          Type Custom Designation *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Legal Cell Advisor, Media Secretary..."
                          value={appointCustomDesignation}
                          onChange={(e) => setAppointCustomDesignation(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-stone-300 font-semibold block mb-1">
                        Display Priority / Order *
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={99}
                        required
                        value={appointPriority}
                        onChange={(e) => setAppointPriority(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Photo selector for official portrait */}
                  <ImageGallerySelector
                    label="Official Committee Portrait Photo (Use Registry Avatar or Select from Gallery)"
                    selectedImageUrl={appointPhotoUrl}
                    onSelectImage={(url) => setAppointPhotoUrl(url)}
                  />

                  {/* Submit buttons */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
                    <button
                      type="button"
                      onClick={() => setSelectedMemberForAppoint(null)}
                      className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Confirm & Appoint to Committee</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* MODAL 2: EDIT EXISTING COMMITTEE MEMBER */}
        {editingCommitteeMember && (
          <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-stone-900 border border-amber-500/50 rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl space-y-4 my-6 text-stone-100 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <Edit className="w-4 h-4" />
                  <span>Edit Committee Official: {editingCommitteeMember.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingCommitteeMember(null)}
                  className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-stone-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEditedCommitteeMember} className="space-y-4 text-xs">
                <div>
                  <label className="text-stone-300 font-semibold block mb-1">
                    Official Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCommitteeMember.name}
                    onChange={(e) =>
                      setEditingCommitteeMember({
                        ...editingCommitteeMember,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-stone-300 font-semibold block mb-1">
                      Designation / Role
                    </label>
                    <input
                      type="text"
                      required
                      value={editingCommitteeMember.designation || editingCommitteeMember.role || ""}
                      onChange={(e) =>
                        setEditingCommitteeMember({
                          ...editingCommitteeMember,
                          designation: e.target.value,
                          role: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-stone-300 font-semibold block mb-1">
                      Order / Priority Number
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      required
                      value={editingCommitteeMember.priority || 1}
                      onChange={(e) =>
                        setEditingCommitteeMember({
                          ...editingCommitteeMember,
                          priority: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-stone-300 font-semibold block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={editingCommitteeMember.phone}
                      onChange={(e) =>
                        setEditingCommitteeMember({
                          ...editingCommitteeMember,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-stone-300 font-semibold block mb-1">
                      Taluk Unit
                    </label>
                    <input
                      type="text"
                      required
                      value={editingCommitteeMember.talukUnit || editingCommitteeMember.taluk || ""}
                      onChange={(e) =>
                        setEditingCommitteeMember({
                          ...editingCommitteeMember,
                          talukUnit: e.target.value as any,
                          taluk: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-stone-300 font-semibold block mb-1">
                    Portfolio / Responsibilities
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCommitteeMember.portfolio || ""}
                    onChange={(e) =>
                      setEditingCommitteeMember({
                        ...editingCommitteeMember,
                        portfolio: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <ImageGallerySelector
                  label="Official Portrait Photo"
                  selectedImageUrl={editingCommitteeMember.photoUrl}
                  onSelectImage={(url) =>
                    setEditingCommitteeMember({
                      ...editingCommitteeMember,
                      photoUrl: url,
                    })
                  }
                />

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => setEditingCommitteeMember(null)}
                    className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const AdminPanelView = AdminPanelModal;


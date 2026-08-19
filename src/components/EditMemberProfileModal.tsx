import React, { useState, useRef, useEffect } from "react";
import { Member, KollamTaluk, MARATHA_ROLES, MarathaRole } from "../types";
import { compressImageFile } from "../lib/imageCompressor";
import {
  X,
  User,
  ShieldCheck,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Building,
  Upload,
  Image as ImageIcon,
  Trash2,
  Save,
  CheckCircle2,
  Briefcase,
  Users,
  Heart,
  Droplet,
} from "lucide-react";

interface EditMemberProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member;
  onSave: (updatedMember: Member) => Promise<void> | void;
}

const TALUK_OPTIONS: KollamTaluk[] = [
  "Kollam Town & East",
  "Karunagappally",
  "Kottarakkara",
  "Punalur",
  "Pathanapuram",
  "Chathannoor & Paravur",
  "Kunnathur",
];

const BLOOD_GROUPS = ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"];

export const EditMemberProfileModal: React.FC<EditMemberProfileModalProps> = ({
  isOpen,
  onClose,
  member,
  onSave,
}) => {
  const [name, setName] = useState(member.name || "");
  const [primaryRole, setPrimaryRole] = useState<MarathaRole>(
    (member.roll as MarathaRole) || "सदस्य"
  );
  const [secondaryRole, setSecondaryRole] = useState<string>(
    member.roll2 && member.roll2 !== "None" && member.roll2 !== member.roll ? member.roll2 : ""
  );

  const [avatarUrl, setAvatarUrl] = useState<string>(member.avatarUrl || "");
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [talukUnit, setTalukUnit] = useState<KollamTaluk>(
    member.talukUnit || "Kollam Town & East"
  );
  const [dob, setDob] = useState(member.dob || member.dateOfBirth || "");
  const [phone, setPhone] = useState(member.phone || "");
  const [email, setEmail] = useState(member.email || "");
  const [bloodGroup, setBloodGroup] = useState(member.bloodGroup || "O+");
  const [occupation, setOccupation] = useState(member.occupation || "");
  const [maritalStatus, setMaritalStatus] = useState<"Single" | "Married" | "Widowed">(
    member.maritalStatus || "Married"
  );
  const [familyMembersCount, setFamilyMembersCount] = useState<number>(
    member.familyMembersCount || 4
  );

  // Address (KL) fields
  const [placeKL, setPlaceKL] = useState(member.place || "");
  const [districtKL, setDistrictKL] = useState(member.district || "Kollam");
  const [addressKL, setAddressKL] = useState(member.address || "");

  // Address (MH) fields
  const [placeMH, setPlaceMH] = useState(member.placeMH || "");
  const [districtMH, setDistrictMH] = useState(member.districtMH || "");
  const [addressMH, setAddressMH] = useState(member.addressMH || "");

  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState("");

  // Sync state whenever member changes or modal is opened
  useEffect(() => {
    if (member && isOpen) {
      setName(member.name || "");
      setPrimaryRole((member.roll as MarathaRole) || "सदस्य");
      setSecondaryRole(
        member.roll2 && member.roll2 !== "None" && member.roll2 !== member.roll ? member.roll2 : ""
      );
      setAvatarUrl(member.avatarUrl || "");
      setTalukUnit(member.talukUnit || "Kollam Town & East");
      setDob(member.dob || member.dateOfBirth || "");
      setPhone(member.phone || "");
      setEmail(member.email || "");
      setBloodGroup(member.bloodGroup || "O+");
      setOccupation(member.occupation || "");
      setMaritalStatus(member.maritalStatus || "Married");
      setFamilyMembersCount(member.familyMembersCount || 4);
      setPlaceKL(member.place || "");
      setDistrictKL(member.district || "Kollam");
      setAddressKL(member.address || "");
      setPlaceMH(member.placeMH || "");
      setDistrictMH(member.districtMH || "");
      setAddressMH(member.addressMH || "");
      setNameError("");
      setPhoneError("");
      setSavedSuccessMsg("");
    }
  }, [member, isOpen]);

  if (!isOpen) return null;

  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressingPhoto(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 600, 600, 0.82);
      setAvatarUrl(compressedDataUrl);
    } catch (err) {
      console.error("Error compressing profile photo:", err);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError("Full Name is mandatory.");
      return;
    }
    setNameError("");

    if (!phone.trim()) {
      setPhoneError("Phone number is required.");
      return;
    }
    setPhoneError("");

    // Normalizing role selection:
    // If user selected only one role, store that single role only!
    const cleanRole1 = primaryRole?.trim() || "सदस्य";
    const cleanRole2 =
      secondaryRole?.trim() &&
      secondaryRole !== "None" &&
      !secondaryRole.includes("None") &&
      secondaryRole !== cleanRole1
        ? secondaryRole.trim()
        : undefined;

    const updatedMember: Member = {
      ...member,
      name: name.trim(),
      roll: cleanRole1,
      roll2: cleanRole2,
      role2: cleanRole2,
      talukUnit,
      place: placeKL.trim() || member.place || "Kollam",
      district: districtKL.trim() || "Kollam",
      dob: dob || member.dob || "1990-01-01",
      dateOfBirth: dob || member.dateOfBirth || "1990-01-01",
      address: addressKL.trim(),
      placeMH: placeMH.trim() || undefined,
      districtMH: districtMH.trim() || undefined,
      addressMH: addressMH.trim() || undefined,
      phone: phone.trim(),
      email: email.trim(),
      bloodGroup: bloodGroup || member.bloodGroup,
      occupation: occupation.trim() || undefined,
      maritalStatus,
      familyMembersCount: Number(familyMembersCount) || 1,
      avatarUrl:
        avatarUrl ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80",
    };

    setIsSaving(true);
    try {
      await onSave(updatedMember);
      setSavedSuccessMsg("Profile and photo updated successfully!");
      setTimeout(() => {
        setSavedSuccessMsg("");
        onClose();
      }, 1200);
    } catch (err) {
      console.error("Error saving updated member profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-start justify-center p-3 sm:p-5 pt-6 sm:pt-10 pb-16 overflow-y-auto">
      <div className="bg-stone-900 border border-amber-500/50 rounded-3xl max-w-xl w-full p-5 sm:p-7 text-stone-100 shadow-2xl relative space-y-5 my-2 sm:my-4">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-stone-100 transition-colors"
          aria-label="Close Profile Editor"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pr-8 space-y-1 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/40">
              {member.memberId || "MEMBER"}
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Active Member Profile
            </span>
          </div>
          <h3 className="text-xl font-black text-amber-100 flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" />
            <span>Edit My Member Profile & Photo</span>
          </h3>
          <p className="text-xs text-stone-400">
            Update your personal details, Maratha designation role, address, and profile photo.
          </p>
        </div>

        {savedSuccessMsg && (
          <div className="p-3 bg-emerald-950/90 border border-emerald-500/60 rounded-2xl text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in duration-200 shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-bold">{savedSuccessMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* PROFILE PICTURE UPLOAD FROM GALLERY */}
          <div className="bg-stone-950/90 p-4 rounded-2xl border border-amber-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-amber-300 font-bold flex items-center gap-1.5 text-xs">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>Profile Picture / Photo (Upload from Gallery)</span>
              </label>
              <span className="text-[10px] text-amber-400/80 font-mono">JPG / PNG</span>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoFileChange}
              className="hidden"
            />

            <div className="flex items-center gap-4">
              {/* Photo Preview Thumbnail */}
              <div className="relative w-20 h-24 rounded-2xl overflow-hidden bg-stone-900 border-2 border-amber-400 flex items-center justify-center shrink-0 shadow-lg group">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name || "Member"}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-10 h-10 text-stone-600" />
                )}
                {isCompressingPhoto && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-[10px] font-bold text-amber-300 text-center p-1">
                    Optimizing...
                  </div>
                )}
              </div>

              {/* Photo Action Buttons */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{avatarUrl ? "Change Photo" : "Upload from Gallery"}</span>
                  </button>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl("")}
                      className="px-3 py-2 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-500/40 rounded-xl text-xs flex items-center gap-1 transition-all"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-stone-400 leading-relaxed">
                  {isCompressingPhoto
                    ? "Compressing image for fast digital pass display..."
                    : avatarUrl
                    ? "Photo selected. This photo appears on your Digital ID Card & Directory."
                    : "Select a clear portrait photo from your mobile or computer gallery."}
                </p>
              </div>
            </div>
          </div>

          {/* FULL NAME */}
          <div className="bg-stone-950/80 p-3.5 rounded-2xl border border-stone-800 space-y-1">
            <label htmlFor="edit-member-name" className="text-amber-300 font-bold flex items-center gap-1.5 text-xs">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Full Name (With Initial) *</span>
            </label>
            <input
              id="edit-member-name"
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError("");
              }}
              placeholder="e.g. Sri. Ramesh Rao"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border ${
                nameError ? "border-red-500" : "border-stone-700 focus:border-amber-500"
              } text-stone-100 font-medium focus:outline-none transition-all`}
            />
            {nameError && <p className="text-red-400 text-[11px] font-semibold">{nameError}</p>}
          </div>

          {/* ROLE / DESIGNATION SELECTION (SINGLE OR DUAL ROLE) */}
          <div className="bg-stone-950/90 p-4 rounded-2xl border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-amber-300 font-bold flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Member Role / Designation (पद निवड)</span>
              </span>
              <span className="text-[10px] text-stone-400">
                एक किंवा दोन पदे निवडण्याची सुविधा
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Primary Role */}
              <div className="space-y-1">
                <label htmlFor="edit-primary-role" className="text-stone-300 font-semibold text-[11px] block">
                  Primary Role (पहिला पद) *
                </label>
                <select
                  id="edit-primary-role"
                  value={primaryRole}
                  onChange={(e) => setPrimaryRole(e.target.value as MarathaRole)}
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500 font-medium"
                >
                  {MARATHA_ROLES.map((r) => (
                    <option key={`primary-${r}`} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Secondary Role */}
              <div className="space-y-1">
                <label htmlFor="edit-secondary-role" className="text-stone-300 font-semibold text-[11px] block">
                  Secondary Role (दुसरा पद) <span className="text-stone-400 font-normal">(ऐच्छिक / Optional)</span>
                </label>
                <select
                  id="edit-secondary-role"
                  value={secondaryRole}
                  onChange={(e) => setSecondaryRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="">नाही / None (एकच पद ठेवा)</option>
                  {MARATHA_ROLES.map((r) => (
                    <option key={`secondary-${r}`} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-[11px] text-stone-400 italic">
              💡 टीप: आपण फक्त एक पद निवडल्यास (उदा. सदस्य / अध्यक्ष), डिजिटल कार्ड आणि डिरेक्टरीमध्ये फक्त ते एकच पद दिसेल.
            </p>
          </div>

          {/* CONTACT: PHONE & EMAIL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-stone-950/80 p-3 rounded-2xl border border-stone-800 space-y-1">
              <label htmlFor="edit-member-phone" className="text-stone-300 font-bold flex items-center gap-1 text-[11px]">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Phone / Mobile *</span>
              </label>
              <input
                id="edit-member-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (phoneError) setPhoneError("");
                }}
                className={`w-full px-3 py-2 rounded-xl bg-stone-900 border ${
                  phoneError ? "border-red-500" : "border-stone-700 focus:border-amber-500"
                } text-stone-100 font-mono text-xs focus:outline-none`}
              />
              {phoneError && <p className="text-red-400 text-[10px]">{phoneError}</p>}
            </div>

            <div className="bg-stone-950/80 p-3 rounded-2xl border border-stone-800 space-y-1">
              <label htmlFor="edit-member-email" className="text-stone-300 font-bold flex items-center gap-1 text-[11px]">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Email Address</span>
              </label>
              <input
                id="edit-member-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* DATE OF BIRTH & BLOOD GROUP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-stone-950/80 p-3 rounded-2xl border border-stone-800 space-y-1">
              <label htmlFor="edit-member-dob" className="text-stone-300 font-bold flex items-center gap-1 text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Date of Birth (DOB)</span>
              </label>
              <input
                id="edit-member-dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="bg-stone-950/80 p-3 rounded-2xl border border-stone-800 space-y-1">
              <label htmlFor="edit-member-blood" className="text-stone-300 font-bold flex items-center gap-1 text-[11px]">
                <Droplet className="w-3.5 h-3.5 text-red-400" />
                <span>Blood Group</span>
              </label>
              <select
                id="edit-member-blood"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500 font-mono font-bold"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* TALUK UNIT & PLACE (KERALA) */}
          <div className="bg-stone-950/90 p-4 rounded-2xl border border-stone-800 space-y-3">
            <h4 className="text-amber-300 font-bold flex items-center gap-1.5 text-xs">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Residential Address in Kerala (KL)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="edit-taluk-unit" className="text-stone-400 text-[11px] block">Taluk Unit</label>
                <select
                  id="edit-taluk-unit"
                  value={talukUnit}
                  onChange={(e) => setTalukUnit(e.target.value as KollamTaluk)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                >
                  {TALUK_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="edit-place-kl" className="text-stone-400 text-[11px] block">Place / Area (KL)</label>
                <input
                  id="edit-place-kl"
                  type="text"
                  value={placeKL}
                  onChange={(e) => setPlaceKL(e.target.value)}
                  placeholder="e.g. Karunagappally, Kadappakada"
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="edit-address-kl" className="text-stone-400 text-[11px] block">Full Address (KL)</label>
              <textarea
                id="edit-address-kl"
                rows={2}
                value={addressKL}
                onChange={(e) => setAddressKL(e.target.value)}
                placeholder="Enter house name, street, post office & pin code..."
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* MAHARASHTRA ORIGIN ADDRESS (OPTIONAL) */}
          <div className="bg-stone-950/70 p-3.5 rounded-2xl border border-stone-800/80 space-y-2.5">
            <h4 className="text-stone-300 font-bold flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-amber-400" />
                <span>Native Place in Maharashtra (MH)</span>
              </span>
              <span className="text-[10px] text-stone-500">(Optional)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label htmlFor="edit-place-mh" className="text-stone-400 text-[10px] block mb-0.5">Place / Village (MH)</label>
                <input
                  id="edit-place-mh"
                  type="text"
                  value={placeMH}
                  onChange={(e) => setPlaceMH(e.target.value)}
                  placeholder="e.g. Kolhapur, Satara, Pune"
                  className="w-full px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label htmlFor="edit-district-mh" className="text-stone-400 text-[10px] block mb-0.5">District (MH)</label>
                <input
                  id="edit-district-mh"
                  type="text"
                  value={districtMH}
                  onChange={(e) => setDistrictMH(e.target.value)}
                  placeholder="e.g. Kolhapur, Sangli"
                  className="w-full px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* OCCUPATION & MARITAL STATUS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-stone-950/80 p-3 rounded-2xl border border-stone-800 space-y-1 sm:col-span-1">
              <label htmlFor="edit-occupation" className="text-stone-300 font-bold flex items-center gap-1 text-[11px]">
                <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                <span>Occupation</span>
              </label>
              <input
                id="edit-occupation"
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="e.g. Business, Engineer"
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="bg-stone-950/80 p-3 rounded-2xl border border-stone-800 space-y-1">
              <label htmlFor="edit-marital-status" className="text-stone-300 font-bold flex items-center gap-1 text-[11px]">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>Marital Status</span>
              </label>
              <select
                id="edit-marital-status"
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="Married">Married</option>
                <option value="Single">Single</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>

            <div className="bg-stone-950/80 p-3 rounded-2xl border border-stone-800 space-y-1">
              <label htmlFor="edit-family-count" className="text-stone-300 font-bold flex items-center gap-1 text-[11px]">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Family Members</span>
              </label>
              <input
                id="edit-family-count"
                type="number"
                min={1}
                max={20}
                value={familyMembersCount}
                onChange={(e) => setFamilyMembersCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || isCompressingPhoto}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs shadow-lg flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving Live..." : "Save Profile & Picture"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState, useRef } from "react";
import { Member, KollamTaluk, MARATHA_ROLES, MarathaRole } from "../types";
import { compressImageFile } from "../lib/imageCompressor";
import {
  X,
  UserPlus,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Building,
  User,
  Upload,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";

interface MembershipRegistrationModalProps {
  onClose: () => void;
  onAddMember: (newMember: Member) => void;
}

export const MembershipRegistrationModal: React.FC<MembershipRegistrationModalProps> = ({
  onClose,
  onAddMember,
}) => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [primaryRole, setPrimaryRole] = useState<MarathaRole>("सदस्य");
  const [secondaryRole, setSecondaryRole] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [talukUnit, setTalukUnit] = useState<KollamTaluk>("Kollam Town & East");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [maritalStatus, setMaritalStatus] = useState<"Single" | "Married" | "Widowed">("Married");
  const [familyMembersCount, setFamilyMembersCount] = useState(4);

  // Address (KL) fields
  const [placeKL, setPlaceKL] = useState("Kollam");
  const [districtKL, setDistrictKL] = useState("Kollam");
  const [addressKL, setAddressKL] = useState("");

  // Address (MH) fields
  const [placeMH, setPlaceMH] = useState("");
  const [districtMH, setDistrictMH] = useState("");
  const [addressMH, setAddressMH] = useState("");

  const [submittedForApproval, setSubmittedForApproval] = useState<Member | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setNameError("Full Name is mandatory. Please enter the member's name.");
      return;
    }
    setNameError("");

    const cleanRole1 = primaryRole?.trim() || "सदस्य";
    const cleanRole2 =
      secondaryRole?.trim() &&
      secondaryRole !== "None" &&
      !secondaryRole.includes("None") &&
      secondaryRole !== cleanRole1
        ? secondaryRole.trim()
        : undefined;

    const newIdNum = Math.floor(1020 + Math.random() * 900);
    const newMember: Member = {
      id: `m-${Date.now()}`,
      memberId: `KLM-MWA-${newIdNum}`,
      name: name.trim(),
      roll: cleanRole1,
      roll2: cleanRole2,
      role2: cleanRole2,
      talukUnit,
      place: placeKL.trim() || "Kollam",
      district: districtKL.trim() || "Kollam",
      dob: dob || "1990-01-01",
      address: addressKL.trim(),
      placeMH: placeMH.trim() || "",
      districtMH: districtMH.trim() || "",
      addressMH: addressMH.trim() || "",
      phone: phone.trim(),
      email: email.trim() || `${name.trim().toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
      bloodGroup: bloodGroup || "O+",
      maritalStatus,
      familyMembersCount: Number(familyMembersCount) || 1,
      joiningYear: 2026,
      status: "Pending Approval",
      password: "1234",
      hasChangedPasscode: false,
      avatarUrl:
        avatarUrl ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80",
    };

    onAddMember(newMember);
    setSubmittedForApproval(newMember);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 pt-8 sm:pt-12 pb-16 overflow-y-auto">
      <div className="bg-stone-900 border border-amber-600/50 rounded-2xl max-w-lg w-full p-6 text-stone-100 shadow-2xl relative space-y-5 my-2 sm:my-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedForApproval ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-amber-950/80 border-2 border-amber-500 text-amber-400 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-amber-100">
              Application Sent for Admin Approval
            </h3>
            <p className="text-xs text-stone-300 max-w-sm mx-auto leading-relaxed">
              Thank you <strong className="text-amber-300">{submittedForApproval.name}</strong>. Your membership registration form has been submitted and sent to the association administrator for verification.
            </p>

            <div className="bg-stone-950 p-4 rounded-xl border border-amber-500/40 text-center space-y-1.5">
              <span className="text-[10px] text-stone-400 block uppercase font-bold">
                Assigned Application Reference ID
              </span>
              <span className="text-xl font-mono font-black text-amber-400 block">
                {submittedForApproval.memberId}
              </span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/90 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Status: Awaiting Admin Approval</span>
              </div>
            </div>

            <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800 text-[11px] text-stone-300 text-left space-y-1">
              <p className="font-semibold text-amber-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>What happens next?</span>
              </p>
              <p className="text-stone-400">
                Your profile and digital ID card will be activated and displayed in the public <strong>Member Directory</strong> immediately after the administrator approves your application in the Admin Panel.
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Done & Close
            </button>
          </div>
        ) : (
          <>
            <div className="pr-8 space-y-1">
              <span className="text-[10px] font-bold uppercase text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-full border border-amber-600/30">
                Regd. No. KLM/TC/101/2024
              </span>
              <h3 className="text-xl font-black text-amber-100 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-500" />
                <span>New Member Registration</span>
              </h3>
              <p className="text-xs text-stone-400">
                Submit application to Kollam District Maratha Welfare Association. (Sent to Admin for Approval)
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {/* MEMBER PHOTO FROM GALLERY (NO URL FIELD) */}
              <div className="bg-stone-950/90 p-3.5 rounded-xl border border-amber-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-amber-300 font-bold flex items-center gap-1.5 text-xs">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>Member Photo (Select from Gallery / Camera)</span>
                  </label>
                  <span className="text-[10px] text-stone-400">(Optional)</span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoFileChange}
                  className="hidden"
                />

                <div className="flex items-center gap-4">
                  {/* Photo Preview Thumbnail */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-900 border-2 border-amber-500/50 flex items-center justify-center shrink-0 shadow-md">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Member Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <User className="w-8 h-8 text-stone-600" />
                    )}
                  </div>

                  {/* Photo Controls */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{avatarUrl ? "Change Photo" : "Upload from Gallery"}</span>
                      </button>

                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={() => setAvatarUrl("")}
                          className="px-2 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-500/40 rounded-lg text-xs flex items-center gap-1 transition-all"
                          title="Remove Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-400">
                      {isCompressingPhoto
                        ? "Compressing image..."
                        : avatarUrl
                        ? "Photo selected successfully from your gallery."
                        : "Click to choose a passport photo from your mobile/device gallery."}
                    </p>
                  </div>
                </div>
              </div>

              {/* TOP FIELD: MEMBER FULL NAME */}
              <div className="bg-stone-950/90 p-3 rounded-xl border border-amber-500/40">
                <label htmlFor="membership-full-name" className="text-amber-300 font-bold flex items-center gap-1.5 text-xs mb-1.5">
                  <User className="w-4 h-4 text-amber-400" />
                  <span>Member Full Name (With Initial) *</span>
                </label>
                <input
                  id="membership-full-name"
                  type="text"
                  required
                  placeholder="Enter full name of member (e.g. Sri. Ramesh Rao)"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) setNameError("");
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border ${
                    nameError ? "border-red-500 ring-1 ring-red-500" : "border-stone-700 focus:border-amber-500"
                  } text-stone-100 font-medium placeholder:text-stone-500 focus:outline-none transition-all`}
                />
                {nameError && (
                  <p className="text-red-400 text-[11px] mt-1 font-semibold">
                    {nameError}
                  </p>
                )}
              </div>

              {/* DUAL ROLE / DESIGNATION SELECTION (MARATHI ROLES) */}
              <div className="bg-stone-950/80 p-3 rounded-xl border border-amber-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-amber-300 font-bold flex items-center gap-1.5 text-xs">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Member Role / Designation (पद निवड)</span>
                  </span>
                  <span className="text-[10px] text-stone-400">दोन पदे निवडण्याची सुविधा</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Primary Role (Required) */}
                  <div className="space-y-1">
                    <label htmlFor="primary-role-select" className="text-stone-300 font-semibold text-[11px] block">
                      Primary Role (पहिला पद) *
                    </label>
                    <select
                      id="primary-role-select"
                      value={primaryRole}
                      onChange={(e) => setPrimaryRole(e.target.value as MarathaRole)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500 font-medium"
                    >
                      {MARATHA_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Secondary Role (Optional) */}
                  <div className="space-y-1">
                    <label htmlFor="secondary-role-select" className="text-stone-300 font-semibold text-[11px] block">
                      Secondary Role (दुसरा पद) <span className="text-stone-400 font-normal">(ऐच्छिक / Optional)</span>
                    </label>
                    <select
                      id="secondary-role-select"
                      value={secondaryRole}
                      onChange={(e) => setSecondaryRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value="">नाही / None (ऐच्छिक)</option>
                      {MARATHA_ROLES.map((r) => (
                        <option key={`secondary-${r}`} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Date of Birth & Blood Group (Optional) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-bold block mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Date of Birth (DOB) *</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">
                    Blood Group <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Select (Optional)</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              {/* Mobile Phone */}
              <div>
                <label className="text-stone-300 font-bold block mb-1">
                  Mobile Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 94470 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* SECTION: Address (KL) */}
              <div className="bg-stone-950/80 p-3.5 rounded-2xl border border-amber-500/30 space-y-2.5">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Address (KL)</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-stone-300 font-bold block mb-1">
                      Place *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Karunagappally / Kollam"
                      value={placeKL}
                      onChange={(e) => setPlaceKL(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-stone-300 font-bold block mb-1">
                      District *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kollam"
                      value={districtKL}
                      onChange={(e) => setDistrictKL(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">
                    Kollam Taluk Unit *
                  </label>
                  <select
                    value={talukUnit}
                    onChange={(e) => setTalukUnit(e.target.value as KollamTaluk)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500"
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

                <div>
                  <label className="text-stone-300 font-bold block mb-1">
                    Address (KL) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="House/Door No, Street, Post Office, Pin Code..."
                    value={addressKL}
                    onChange={(e) => setAddressKL(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* SECTION: Address (MH) */}
              <div className="bg-stone-950/80 p-3.5 rounded-2xl border border-stone-800 space-y-2.5">
                <div className="flex items-center gap-1.5 text-stone-200 font-bold text-xs">
                  <Building className="w-3.5 h-3.5 text-amber-400" />
                  <span>Address (MH)</span>
                  <span className="text-[10px] text-stone-400 font-normal ml-auto">(Native / Maharashtra)</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-stone-300 font-bold block mb-1">
                      Place
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kolhapur / Satara / Pune"
                      value={placeMH}
                      onChange={(e) => setPlaceMH(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-stone-300 font-bold block mb-1">
                      District
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kolhapur"
                      value={districtMH}
                      onChange={(e) => setDistrictMH(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder="Village/Town, Taluka, Pin Code (MH)..."
                    value={addressMH}
                    onChange={(e) => setAddressMH(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">
                  Marital Status & Family Count
                </label>
                <div className="flex gap-2">
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value as any)}
                    className="w-full px-2 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 text-xs"
                  >
                    <option value="Married">Married</option>
                    <option value="Single">Single</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={familyMembersCount}
                    onChange={(e) => setFamilyMembersCount(Number(e.target.value))}
                    className="w-20 px-2 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 text-xs font-mono text-center"
                    placeholder="Count"
                  />
                </div>
              </div>

              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-[11px] text-stone-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 inline mr-1" />
                By submitting, your form will be submitted for <strong>Admin Approval</strong> before inclusion in the directory.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-lg flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Submit for Admin Approval</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

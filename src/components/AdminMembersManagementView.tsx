import React, { useState } from "react";
import { Member, KollamTaluk, MARATHA_ROLES } from "../types";
import {
  Users,
  Search,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  Save,
  AlertTriangle,
  MapPin,
  Phone,
  Calendar,
  Sparkles,
  ShieldCheck,
  Building,
  KeyRound,
  Lock,
  RotateCcw,
  Check,
  UserPlus,
  Plus,
  Loader2,
} from "lucide-react";

interface AdminMembersManagementViewProps {
  members: Member[];
  onUpdateMember: (member: Member) => void;
  onDeleteMember: (memberId: string) => void;
  onAddMember?: (member: Member) => void;
}

export const AdminMembersManagementView: React.FC<AdminMembersManagementViewProps> = ({
  members,
  onUpdateMember,
  onDeleteMember,
  onAddMember,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTaluk, setSelectedTaluk] = useState<string>("ALL");
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);
  const [resettingPasswordMember, setResettingPasswordMember] = useState<Member | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState("2026");
  const [savedSuccessMsg, setSavedSuccessMsg] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Dynamic Save States for Color Transition
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [savedEditSuccess, setSavedEditSuccess] = useState(false);
  const [isSavingAdd, setIsSavingAdd] = useState(false);
  const [savedAddSuccess, setSavedAddSuccess] = useState(false);
  const [isSavingReset, setIsSavingReset] = useState(false);
  const [savedResetSuccess, setSavedResetSuccess] = useState(false);

  // New member form state
  const [newMemberForm, setNewMemberForm] = useState<Partial<Member>>({
    name: "",
    memberId: `KMWA-${String(members.length + 101).padStart(3, "0")}`,
    phone: "",
    email: "",
    talukUnit: "Kollam Town & East",
    houseName: "",
    place: "Kollam",
    district: "Kollam",
    status: "Active",
    roll: "सदस्य",
    role2: "None",
    bloodGroup: "O+",
    dateOfBirth: "1990-01-01",
    password: "1234",
  });

  const filteredMembers = members.filter((m) => {
    if (m.status === "Pending Approval") return false;
    if (selectedTaluk !== "ALL" && m.talukUnit !== selectedTaluk) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.memberId.toLowerCase().includes(q) ||
        (m.roll || "").toLowerCase().includes(q) ||
        (m.place || "").toLowerCase().includes(q) ||
        (m.district || "").toLowerCase().includes(q) ||
        (m.placeMH || "").toLowerCase().includes(q) ||
        (m.districtMH || "").toLowerCase().includes(q) ||
        (m.address || "").toLowerCase().includes(q) ||
        (m.addressMH || "").toLowerCase().includes(q) ||
        m.phone.includes(q)
      );
    }
    return true;
  });

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    setIsSavingEdit(true);

    try {
      const cleanRole1 = editingMember.roll?.trim() || "सदस्य";
      const cleanRole2 =
        editingMember.roll2?.trim() &&
        editingMember.roll2 !== "None" &&
        !editingMember.roll2.includes("None") &&
        editingMember.roll2 !== cleanRole1
          ? editingMember.roll2.trim()
          : undefined;

      const normalizedMember: Member = {
        ...editingMember,
        roll: cleanRole1,
        roll2: cleanRole2,
        role2: cleanRole2,
      };

      onUpdateMember(normalizedMember);
      setSavedEditSuccess(true);
      setSavedSuccessMsg(`Member ${editingMember.name} updated successfully!`);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setEditingMember(null);
      setTimeout(() => setSavedSuccessMsg(""), 3500);
    } catch (err) {
      console.error("Error updating member:", err);
    } finally {
      setIsSavingEdit(false);
      setSavedEditSuccess(false);
    }
  };

  const handleConfirmResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingPasswordMember) return;

    setIsSavingReset(true);

    try {
      const cleaned = newPasswordInput.trim().replace(/\D/g, "");
      const updatedPass = cleaned.length === 4 ? cleaned : newPasswordInput.trim() || "1234";
      const updatedMember: Member = {
        ...resettingPasswordMember,
        password: updatedPass,
        hasChangedPasscode: false,
      };

      onUpdateMember(updatedMember);
      setSavedResetSuccess(true);
      setSavedSuccessMsg(`Passcode for ${resettingPasswordMember.name} reset to "${updatedPass}"!`);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setResettingPasswordMember(null);
      setTimeout(() => setSavedSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Error resetting passcode:", err);
    } finally {
      setIsSavingReset(false);
      setSavedResetSuccess(false);
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingMember) return;
    onDeleteMember(deletingMember.id);
    setDeletingMember(null);
    setSavedSuccessMsg("Member permanently removed from database and committee.");
    setTimeout(() => setSavedSuccessMsg(""), 3000);
  };

  const handleAddNewMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberForm.name?.trim() || !newMemberForm.phone?.trim()) return;

    setIsSavingAdd(true);

    try {
      const cleanRole1 = newMemberForm.roll?.trim() || "सदस्य";
      const cleanRole2 =
        newMemberForm.role2?.trim() &&
        newMemberForm.role2 !== "None" &&
        !newMemberForm.role2.includes("None") &&
        newMemberForm.role2 !== cleanRole1
          ? newMemberForm.role2.trim()
          : undefined;

      const created: Member = {
        id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        memberId: newMemberForm.memberId?.trim() || `KMWA-${String(members.length + 101).padStart(3, "0")}`,
        name: newMemberForm.name.trim(),
        phone: newMemberForm.phone.trim(),
        email: newMemberForm.email?.trim() || "",
        talukUnit: (newMemberForm.talukUnit as KollamTaluk) || "Kollam Town & East",
        houseName: newMemberForm.houseName?.trim() || "",
        place: newMemberForm.place?.trim() || "Kollam",
        district: newMemberForm.district?.trim() || "Kollam",
        placeMH: newMemberForm.placeMH?.trim() || "",
        districtMH: newMemberForm.districtMH?.trim() || "",
        address: newMemberForm.address?.trim() || "",
        addressMH: newMemberForm.addressMH?.trim() || "",
        bloodGroup: newMemberForm.bloodGroup || "O+",
        dateOfBirth: newMemberForm.dateOfBirth || "1990-01-01",
        status: "Active",
        roll: cleanRole1,
        roll2: cleanRole2,
        role2: cleanRole2,
        password: newMemberForm.password?.trim() || "1234",
        hasChangedPasscode: false,
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      };

      if (onAddMember) {
        onAddMember(created);
      } else {
        onUpdateMember(created);
      }

      setSavedAddSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 600));

      setIsAddModalOpen(false);
      setNewMemberForm({
        name: "",
        memberId: `KMWA-${String(members.length + 102).padStart(3, "0")}`,
        phone: "",
        email: "",
        talukUnit: "Kollam Town & East",
        houseName: "",
        place: "Kollam",
        district: "Kollam",
        status: "Active",
        roll: "सदस्य",
        role2: "None",
        bloodGroup: "O+",
        dateOfBirth: "1990-01-01",
        password: "1234",
      });

      setSavedSuccessMsg(`New member ${created.name} registered and saved to database!`);
      setTimeout(() => setSavedSuccessMsg(""), 4000);
    } catch (err) {
      console.error("Error adding member:", err);
    } finally {
      setIsSavingAdd(false);
      setSavedAddSuccess(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Search, Filter and Add Button */}
      <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-amber-100">
                Manage All Members Directory
              </h3>
              <p className="text-[11px] text-stone-400">
                Edit attributes or remove any member record ({members.length} registered)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Add Member</span>
            </button>

            {savedSuccessMsg && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3.5 py-1.5 rounded-xl border border-emerald-500/40 flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{savedSuccessMsg}</span>
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="sm:col-span-2 relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Name, Member ID, Phone, Place..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <select
              value={selectedTaluk}
              onChange={(e) => setSelectedTaluk(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Taluk Units</option>
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
      </div>

      {/* Members Grid / List */}
      <div className="space-y-2.5">
        <div className="text-xs text-stone-400 flex items-center justify-between px-1">
          <span>
            Showing <strong>{filteredMembers.length}</strong> of {members.length} members
          </span>
        </div>

        {filteredMembers.length === 0 ? (
          <div className="p-8 bg-stone-950 rounded-2xl border border-stone-800 text-center space-y-2">
            <Users className="w-8 h-8 text-stone-500 mx-auto" />
            <p className="text-sm font-bold text-stone-300">No members found</p>
            <p className="text-xs text-stone-400">
              Try adjusting your search keywords or taluk filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="bg-stone-950 p-4 rounded-2xl border border-stone-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src={
                      member.avatarUrl ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"
                    }
                    alt={member.name}
                    className="w-14 h-16 rounded-xl object-cover border border-amber-500/40 bg-stone-800 shrink-0 shadow-sm"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0 space-y-1 text-xs">
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <span className="font-mono text-[10px] font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded border border-amber-500/30 truncate">
                        {member.memberId}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/40">
                          {member.roll || "Member"}
                        </span>
                        {member.roll2 &&
                          member.roll2 !== "None" &&
                          !member.roll2.includes("None") &&
                          member.roll2 !== member.roll && (
                            <span className="text-[10px] font-bold text-stone-300 bg-stone-900 px-2 py-0.5 rounded-full border border-stone-700">
                              {member.roll2}
                            </span>
                          )}
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          {member.status || "Active"}
                        </span>
                      </div>
                    </div>

                    <h4 className="font-bold text-stone-100 text-sm truncate pt-0.5">
                      {member.name}
                    </h4>

                    <p className="text-[11px] text-stone-300 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>
                        {member.place || member.talukUnit || "Kollam"}, {member.district || "Kollam"}
                      </span>
                    </p>

                    <div className="flex items-center gap-2 pt-0.5 text-[10px] text-stone-400 flex-wrap">
                      <a
                        href={`tel:${member.phone}`}
                        className="flex items-center gap-1 font-mono text-stone-300 hover:text-amber-300 hover:underline"
                        title={`Call ${member.name}`}
                      >
                        <Phone className="w-2.5 h-2.5 text-amber-400" />
                        {member.phone}
                      </a>
                      {member.phone && (
                        <a
                          href={`https://wa.me/${member.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Namaskar Sri/Smt ${member.name}, contacting you from KMWA administration.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-0.5 text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 hover:bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/30 text-[10px] font-semibold transition-colors"
                          title={`WhatsApp chat with ${member.name}`}
                        >
                          <span role="img" aria-label="WhatsApp">💬</span>
                          <span>WhatsApp</span>
                        </a>
                      )}
                      {member.bloodGroup && (
                        <span className="text-red-400 font-bold bg-red-950/50 px-1.5 py-0.2 rounded border border-red-500/20">
                          {member.bloodGroup}
                        </span>
                      )}
                      {member.dob && (
                        <span className="flex items-center gap-1 text-amber-300/80">
                          <Calendar className="w-2.5 h-2.5" />
                          DOB: {member.dob}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edit, Reset Password & Delete Action Buttons */}
                <div className="pt-2 border-t border-stone-800 flex items-center justify-between gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setResettingPasswordMember(member);
                      setNewPasswordInput(member.password || "2026");
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 transition-all"
                    title="Reset member login password"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reset Password</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingMember(member)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow transition-all"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingMember(member)}
                      className="px-2.5 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-500/30 font-bold text-xs flex items-center gap-1 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT MEMBER MODAL */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-amber-600/50 rounded-2xl max-w-lg w-full p-6 text-stone-100 shadow-2xl relative space-y-4 my-8">
            <button
              onClick={() => setEditingMember(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pr-8 space-y-1">
              <h3 className="text-lg font-bold text-amber-100 flex items-center gap-2">
                <Edit className="w-5 h-5 text-amber-400" />
                <span>Edit Member Attributes</span>
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Editing {editingMember.memberId} • {editingMember.name}
              </p>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">
                    Member ID
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.memberId}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, memberId: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-amber-300 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">
                    Membership Status
                  </label>
                  <select
                    value={editingMember.status}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, status: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100"
                  >
                    <option value="Active">Active Member</option>
                    <option value="Life Member">Life Member</option>
                    <option value="Patron Member">Patron Member</option>
                    <option value="Pending Approval">Pending Approval</option>
                  </select>
                </div>
              </div>

              {/* DUAL ROLE / DESIGNATION FIELD (MARATHA ROLES) */}
              <div className="bg-stone-950 p-3 rounded-xl border border-amber-500/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-amber-300 font-bold flex items-center gap-1.5 text-xs">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Member Roles / Designation (पद निवड)</span>
                  </span>
                  <span className="text-[10px] text-stone-400">दोन पदे निवडण्याची सुविधा</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-stone-300 font-semibold block mb-1 text-[11px]">
                      Primary Role (पहिला पद) *
                    </label>
                    <select
                      value={editingMember.roll || "सदस्य"}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, roll: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500 font-medium"
                    >
                      {MARATHA_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-stone-300 font-semibold block mb-1 text-[11px]">
                      Secondary Role (दुसरा पद) <span className="text-stone-400 font-normal">(Optional)</span>
                    </label>
                    <select
                      value={editingMember.roll2 || ""}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, roll2: e.target.value || undefined })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value="">नाही / None (ऐच्छिक)</option>
                      {MARATHA_ROLES.map((r) => (
                        <option key={`edit-sec-${r}`} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* FULL NAME */}
              <div>
                <label className="text-stone-300 font-bold block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingMember.name}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-medium"
                />
              </div>

              {/* MEMBER PASSWORD / PASSCODE */}
              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 space-y-1.5">
                <label className="text-stone-300 font-bold flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>Member 4-Digit Passcode</span>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingMember({ ...editingMember, password: "1234", hasChangedPasscode: false })
                    }
                    className="text-[10px] text-amber-400 hover:text-amber-300 underline font-bold"
                  >
                    Reset to Default (1234)
                  </button>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  placeholder="Enter 4-digit passcode (e.g. 1234)"
                  value={editingMember.password || ""}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, password: e.target.value.replace(/\D/g, "").slice(0, 4) })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 font-mono tracking-widest text-sm font-bold"
                />
                <p className="text-[10px] text-stone-400">
                  Numeric 4 digits only. If reset to 1234, member will be prompted to choose a new passcode on their next login.
                </p>
              </div>

              {/* Date of Birth & Blood Group */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-bold block mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Date of Birth (DOB)</span>
                  </label>
                  <input
                    type="date"
                    value={editingMember.dob || ""}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, dob: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100"
                  />
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">
                    Blood Group <span className="text-stone-400 font-normal">(Optional)</span>
                  </label>
                  <select
                    value={editingMember.bloodGroup || ""}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, bloodGroup: e.target.value || undefined })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-mono"
                  >
                    <option value="">None / Not Specified</option>
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
                  Mobile Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={editingMember.phone}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-mono"
                />
              </div>

              {/* Address (KL) */}
              <div className="bg-stone-950/80 p-3 rounded-xl border border-amber-500/30 space-y-2.5">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Address (KL)</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-stone-300 font-bold block mb-1">
                      Place (KL) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingMember.place || ""}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, place: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="text-stone-300 font-bold block mb-1">
                      District (KL) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingMember.district || "Kollam"}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, district: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">
                    Taluk Unit *
                  </label>
                  <select
                    value={editingMember.talukUnit}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, talukUnit: e.target.value as KollamTaluk })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100"
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
                    value={editingMember.address || ""}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, address: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100"
                  />
                </div>
              </div>

              {/* Address (MH) */}
              <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800 space-y-2.5">
                <div className="flex items-center gap-1.5 text-stone-200 font-bold text-xs">
                  <Building className="w-3.5 h-3.5 text-amber-400" />
                  <span>Address (MH)</span>
                  <span className="text-[10px] text-stone-400 font-normal ml-auto">(Native / Maharashtra)</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-stone-300 font-bold block mb-1">
                      Place (MH)
                    </label>
                    <input
                      type="text"
                      value={editingMember.placeMH || ""}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, placeMH: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="text-stone-300 font-bold block mb-1">
                      District (MH)
                    </label>
                    <input
                      type="text"
                      value={editingMember.districtMH || ""}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, districtMH: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">
                    Address (MH)
                  </label>
                  <input
                    type="text"
                    value={editingMember.addressMH || ""}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, addressMH: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-stone-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">
                  Photo URL
                </label>
                <input
                  type="text"
                  value={editingMember.avatarUrl || ""}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, avatarUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2 transition-all duration-300 ${
                    isSavingEdit
                      ? "bg-emerald-600 hover:bg-emerald-600 text-white animate-pulse ring-2 ring-emerald-400 shadow-emerald-600/50 cursor-wait"
                      : savedEditSuccess
                      ? "bg-emerald-500 text-stone-950 font-black ring-2 ring-emerald-300 shadow-emerald-500/40"
                      : "bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/30"
                  }`}
                >
                  {isSavingEdit ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Saving Member Information...</span>
                    </>
                  ) : savedEditSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-stone-950 stroke-[3]" />
                      <span>Member Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Member</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {resettingPasswordMember && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-amber-500/50 rounded-2xl max-w-md w-full p-6 text-stone-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-amber-100">
                    Reset Member Password
                  </h3>
                  <p className="text-xs text-stone-400 font-mono">
                    {resettingPasswordMember.name} ({resettingPasswordMember.memberId})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setResettingPasswordMember(null)}
                className="p-1.5 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmResetPassword} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
                <p className="text-stone-300">
                  Registered Mobile: <strong className="text-amber-300 font-mono">{resettingPasswordMember.phone}</strong>
                </p>
                <p className="text-stone-400 text-[11px]">
                  The member can log in using their registered mobile number and this newly set password/passcode.
                </p>
              </div>

              <div>
                <label className="text-stone-300 font-bold block mb-1">
                  New 4-Digit Passcode *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter 4-digit passcode (e.g. 1234)"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-amber-300 font-mono font-bold text-sm tracking-wider focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setNewPasswordInput("1234")}
                  className="flex-1 py-2 px-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center justify-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Default "1234"</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNewPasswordInput("2026")}
                  className="flex-1 py-2 px-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center justify-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Passcode "2026"</span>
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setResettingPasswordMember(null)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingReset}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2 transition-all duration-300 ${
                    isSavingReset
                      ? "bg-emerald-600 hover:bg-emerald-600 text-white animate-pulse ring-2 ring-emerald-400 shadow-emerald-600/50 cursor-wait"
                      : savedResetSuccess
                      ? "bg-emerald-500 text-stone-950 font-black ring-2 ring-emerald-300 shadow-emerald-500/40"
                      : "bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/30"
                  }`}
                >
                  {isSavingReset ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Saving Passcode...</span>
                    </>
                  ) : savedResetSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-stone-950 stroke-[3]" />
                      <span>Passcode Saved!</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Member Passcode</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingMember && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-red-500/40 rounded-2xl max-w-sm w-full p-6 text-stone-100 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-red-950 text-red-400 border border-red-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-100">
                  Delete Member?
                </h3>
                <p className="text-xs text-stone-400">Confirm permanent database removal</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-stone-300 leading-relaxed">
              <p>
                Are you sure you want to permanently delete{" "}
                <strong className="text-amber-300">{deletingMember.name}</strong> (
                {deletingMember.memberId}) from the directory?
              </p>
              <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/20 text-red-300 text-[11px]">
                ⚠️ <strong>Note:</strong> If this member is also serving on the Executive Committee, they will be automatically removed from the Committee Member list as well.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setDeletingMember(null)}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MEMBER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-amber-500/50 rounded-2xl max-w-xl w-full p-6 text-stone-100 shadow-2xl relative space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pr-8 space-y-1">
              <h3 className="text-lg font-bold text-amber-100 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <span>Add & Register New Member</span>
              </h3>
              <p className="text-xs text-stone-400">
                Directly add an approved active member to the directory and permanent database.
              </p>
            </div>

            <form onSubmit={handleAddNewMember} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">
                    Member Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={newMemberForm.name || ""}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">
                    Member ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={newMemberForm.memberId || ""}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, memberId: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-amber-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">
                    Phone / Mobile * (for Login)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={newMemberForm.phone || ""}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-mono"
                  />
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">
                    Initial Passcode (Default 1234)
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={newMemberForm.password || "1234"}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, password: e.target.value.replace(/\D/g, "") })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-amber-400 font-mono font-bold text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">
                    Taluk Unit *
                  </label>
                  <select
                    value={newMemberForm.talukUnit || "Kollam Town & East"}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, talukUnit: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100"
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
                    House Name / Villa
                  </label>
                  <input
                    type="text"
                    placeholder="House / Family Name"
                    value={newMemberForm.houseName || ""}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, houseName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">
                    Place (Kerala)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Asramam, Kollam"
                    value={newMemberForm.place || ""}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, place: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100"
                  />
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">
                    Blood Group
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. O+, A+, B+, AB+"
                    value={newMemberForm.bloodGroup || ""}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, bloodGroup: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">
                    Native Place in MH (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Satara, Kolhapur"
                    value={newMemberForm.placeMH || ""}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, placeMH: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100"
                  />
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">
                    District in MH (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pune, Sangli"
                    value={newMemberForm.districtMH || ""}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, districtMH: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingAdd}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2 transition-all duration-300 cursor-pointer ${
                    isSavingAdd
                      ? "bg-emerald-600 hover:bg-emerald-600 text-white animate-pulse ring-2 ring-emerald-400 shadow-emerald-600/50 cursor-wait"
                      : savedAddSuccess
                      ? "bg-emerald-500 text-stone-950 font-black ring-2 ring-emerald-300 shadow-emerald-500/40"
                      : "bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/30"
                  }`}
                >
                  {isSavingAdd ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Saving Member to Database...</span>
                    </>
                  ) : savedAddSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-stone-950 stroke-[3]" />
                      <span>Member Registered & Saved!</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Member to Database</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

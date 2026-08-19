import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePageView } from "./components/HomePageView";
import { MemberDirectory } from "./components/MemberDirectory";
import { DigitalIDCardModal } from "./components/DigitalIDCardModal";
import { ExecutiveCommitteeView } from "./components/ExecutiveCommitteeView";
import { EventsAnnouncementsView } from "./components/EventsAnnouncementsView";
import { MembershipRegistrationModal } from "./components/MembershipRegistrationModal";
import { AdminPanelModal } from "./components/AdminPanelModal";
import { GoldRatesView } from "./components/GoldRatesView";
import { MemberLoginModal } from "./components/MemberLoginModal";
import { CreateNewPasscodeModal } from "./components/CreateNewPasscodeModal";
import { ChangeMemberPasscodeModal } from "./components/ChangeMemberPasscodeModal";
import { EditMemberProfileModal } from "./components/EditMemberProfileModal";
import { BirthdayView } from "./components/BirthdayView";
import { LogoEmblem } from "./components/LogoEmblem";
import { Power, RotateCcw, X, AlertTriangle } from "lucide-react";

import {
  INITIAL_MEMBERS,
  EXECUTIVE_COMMITTEE,
  ASSOCIATION_EVENTS,
  GALLERY_ITEMS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ADVERTISEMENTS,
  INITIAL_PENDING_MEMBERS,
  INITIAL_GOLD_RATES,
  INITIAL_GOLD_PROMOS,
} from "./data/kollamData";
import {
  Member,
  AppNotification,
  AdvertisementSlide,
  ExecutiveMember,
  GoldRates,
  GoldRatePromo,
  CurrentUser,
  AssociationEvent,
  GalleryItem,
} from "./types";
import {
  initializeFirestoreDataIfEmpty,
  getCachedActiveMembers,
  getCachedPendingMembers,
  getCachedCommittee,
  saveCachedCommittee,
  getCachedEvents,
  saveCachedEvents,
  getCachedGallery,
  saveCachedGallery,
  subscribeToMembers,
  subscribeToPendingMembers,
  subscribeToNotifications,
  subscribeToAdvertisements,
  subscribeToCommittee,
  subscribeToEvents,
  subscribeToGallery,
  subscribeToGoldRates,
  subscribeToGoldPromos,
  subscribeToAdminPasscode,
  saveAdminPasscodeOnline,
  resetMemberPasscodeOnline,
  updateMemberPasscodeOnline,
  submitPendingMemberOnline,
  approveMemberOnline,
  rejectPendingMemberOnline,
  updatePendingMemberDetailsOnline,
  updateMemberOnline,
  deleteMemberOnline,
  saveMemberOnline,
  saveNotificationsOnline,
  saveAdvertisementsOnline,
  saveCommitteeOnline,
  deleteCommitteeMemberOnline,
  saveSingleEventOnline,
  deleteEventOnline,
  saveSingleGalleryItemOnline,
  deleteGalleryItemOnline,
  saveGoldRatesOnline,
  saveGoldPromosOnline,
} from "./lib/firestoreService";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [members, setMembers] = useState<Member[]>(() => getCachedActiveMembers());
  const [pendingMembers, setPendingMembers] = useState<Member[]>(() => getCachedPendingMembers());
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [advertisements, setAdvertisements] = useState<AdvertisementSlide[]>(INITIAL_ADVERTISEMENTS);
  const [committee, setCommittee] = useState<ExecutiveMember[]>(() => getCachedCommittee());
  const [events, setEvents] = useState<AssociationEvent[]>(() => getCachedEvents());
  const [gallery, setGallery] = useState<GalleryItem[]>(() => getCachedGallery());
  const [goldRates, setGoldRates] = useState<GoldRates>(INITIAL_GOLD_RATES);
  const [goldPromos, setGoldPromos] = useState<GoldRatePromo[]>(INITIAL_GOLD_PROMOS);
  const [adminPasscode, setAdminPasscode] = useState<string>("2026");

  // Authentication State: guest | member | admin
  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => {
    try {
      const saved = localStorage.getItem("kollam_maratha_user");
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return { role: "guest" };
  });

  const [selectedMemberForIdCard, setSelectedMemberForIdCard] = useState<Member | null>(null);
  const [registerModalOpen, setRegisterModalOpen] = useState<boolean>(false);
  const [memberLoginModalOpen, setMemberLoginModalOpen] = useState<boolean>(false);
  const [changeMemberPasscodeModalOpen, setChangeMemberPasscodeModalOpen] = useState<boolean>(false);
  const [editingProfileMember, setEditingProfileMember] = useState<Member | null>(null);
  const [closeConfirmModalOpen, setCloseConfirmModalOpen] = useState<boolean>(false);
  const [isAppClosed, setIsAppClosed] = useState<boolean>(false);

  // Persist user auth session
  useEffect(() => {
    try {
      localStorage.setItem("kollam_maratha_user", JSON.stringify(currentUser));
    } catch {
      // ignore
    }
  }, [currentUser]);

  // Initialize online Firestore database and subscribe to real-time sync across multiple devices
  useEffect(() => {
    initializeFirestoreDataIfEmpty();

    const unsubMembers = subscribeToMembers((data) => {
      if (data) setMembers(data);
    });

    const unsubPending = subscribeToPendingMembers((data) => {
      setPendingMembers(data || []);
    });

    const unsubNotifs = subscribeToNotifications((data) => {
      if (data) setNotifications(data);
    });

    const unsubAds = subscribeToAdvertisements((data) => {
      if (data) setAdvertisements(data);
    });

    const unsubCommittee = subscribeToCommittee((data) => {
      if (data) setCommittee(data);
    });

    const unsubEvents = subscribeToEvents((data) => {
      if (data) setEvents(data);
    });

    const unsubGallery = subscribeToGallery((data) => {
      if (data) setGallery(data);
    });

    const unsubGoldRates = subscribeToGoldRates((rates) => {
      if (rates) setGoldRates(rates);
    });

    const unsubGoldPromos = subscribeToGoldPromos((promos) => {
      if (promos) setGoldPromos(promos);
    });

    const unsubAdminPasscode = subscribeToAdminPasscode((pass) => {
      if (pass) setAdminPasscode(pass);
    });

    return () => {
      unsubMembers();
      unsubPending();
      unsubNotifs();
      unsubAds();
      unsubCommittee();
      unsubEvents();
      unsubGallery();
      unsubGoldRates();
      unsubGoldPromos();
      unsubAdminPasscode();
    };
  }, []);

  const handleLoginSuccess = (user: CurrentUser) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser({ role: "guest" });
    setActiveTab("home");
    setSelectedMemberForIdCard(null);
    setMemberLoginModalOpen(false);
    setChangeMemberPasscodeModalOpen(false);
    try {
      localStorage.removeItem("kollam_maratha_user");
    } catch {}
  };

  // Member or Admin updates a member profile and photo
  const handleSaveMemberProfile = async (updatedMember: Member) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === updatedMember.id ? updatedMember : m))
    );

    if (currentUser.role === "member" && currentUser.member?.id === updatedMember.id) {
      setCurrentUser({
        role: "member",
        member: updatedMember,
      });
    }

    setCommittee((prevCommittee) => {
      let changed = false;
      const updatedCommittee = prevCommittee.map((c) => {
        if (
          c.id === updatedMember.id ||
          c.memberId === updatedMember.id ||
          (c.name && c.name.trim().toLowerCase() === updatedMember.name.trim().toLowerCase())
        ) {
          changed = true;
          return {
            ...c,
            name: updatedMember.name,
            phone: updatedMember.phone,
            taluk: updatedMember.talukUnit || c.taluk,
            photoUrl: updatedMember.avatarUrl || c.photoUrl,
          };
        }
        return c;
      });

      if (changed) {
        saveCommitteeOnline(updatedCommittee).catch((err) =>
          console.error("Online committee sync after profile edit error:", err)
        );
      }
      return updatedCommittee;
    });

    try {
      await updateMemberOnline(updatedMember);
    } catch (e) {
      console.error("Online member profile update error:", e);
    }
  };

  // Member sets a new 4-digit numeric passcode on first login
  const handleSaveNewPasscode = async (newPasscode: string) => {
    if (currentUser.role === "member" && currentUser.member) {
      const updatedMember: Member = {
        ...currentUser.member,
        password: newPasscode,
        hasChangedPasscode: true,
      };

      setCurrentUser({
        role: "member",
        member: updatedMember,
      });

      setMembers((prev) =>
        prev.map((m) => (m.id === updatedMember.id ? updatedMember : m))
      );

      try {
        await updateMemberPasscodeOnline(updatedMember.id, newPasscode);
      } catch (err) {
        console.error("Error saving updated member passcode:", err);
      }
    }
  };

  // Logged-in member explicitly resets/changes their passcode via ChangeMemberPasscodeModal
  const handleExplicitMemberChangePasscode = async (newPasscode: string) => {
    if (currentUser.role === "member" && currentUser.member) {
      const updatedMember: Member = {
        ...currentUser.member,
        password: newPasscode,
        hasChangedPasscode: true,
      };

      setCurrentUser({
        role: "member",
        member: updatedMember,
      });

      setMembers((prev) =>
        prev.map((m) => (m.id === updatedMember.id ? updatedMember : m))
      );

      try {
        await updateMemberPasscodeOnline(updatedMember.id, newPasscode);
      } catch (err) {
        console.error("Error changing member passcode:", err);
      }
    }
  };

  // When a user submits an online registration, sync to Firestore pending members for admin approval
  const handleAddMember = async (newMember: Member) => {
    const pendingMember: Member = { ...newMember, status: "Pending Approval" };
    setPendingMembers((prev) => [pendingMember, ...prev]);
    try {
      await submitPendingMemberOnline(pendingMember);
    } catch (e) {
      console.error("Online pending member sync error:", e);
    }
  };

  // Admin adds a member directly into the Active Members Directory
  const handleAddMemberDirectly = async (newMember: Member) => {
    const activeMember: Member = { ...newMember, status: "Active" };
    setMembers((prev) => [activeMember, ...prev.filter((m) => m.id !== activeMember.id)]);
    try {
      await saveMemberOnline(activeMember);
    } catch (e) {
      console.error("Online direct member add error:", e);
    }
  };

  // Admin approves a member -> moves to active members directory online
  const handleApproveMember = async (memberId: string) => {
    const found = pendingMembers.find((m) => m.id === memberId);
    if (found) {
      const approvedMember: Member = { ...found, status: "Active" };
      setMembers((prev) => [approvedMember, ...prev]);
      setPendingMembers((prev) => prev.filter((m) => m.id !== memberId));
      try {
        await approveMemberOnline(found);
      } catch (e) {
        console.error("Online approval sync error:", e);
      }
    }
  };

  // Admin rejects a member
  const handleRejectMember = async (memberId: string) => {
    setPendingMembers((prev) => prev.filter((m) => m.id !== memberId));
    try {
      await rejectPendingMemberOnline(memberId);
    } catch (e) {
      console.error("Online reject sync error:", e);
    }
  };

  // Admin edits a pending member details
  const handleUpdatePendingMemberDetails = async (updatedMember: Member) => {
    setPendingMembers((prev) =>
      prev.map((m) => (m.id === updatedMember.id ? updatedMember : m))
    );
    try {
      await updatePendingMemberDetailsOnline(updatedMember);
    } catch (e) {
      console.error("Online pending update sync error:", e);
    }
  };

  // Admin updates an approved active member details
  const handleUpdateMember = async (updatedMember: Member) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === updatedMember.id ? updatedMember : m))
    );
    try {
      await updateMemberOnline(updatedMember);
    } catch (e) {
      console.error("Online member update error:", e);
    }
  };

  // Admin deletes an approved active member (cascades to Executive Committee)
  const handleDeleteMember = async (memberId: string) => {
    const targetMember = members.find((m) => m.id === memberId || m.memberId === memberId);

    // 1. Remove from local members state
    setMembers((prev) => prev.filter((m) => m.id !== memberId && m.memberId !== memberId));

    // 2. Cascade: remove from committee state if this member is an Executive Committee official
    setCommittee((prevCommittee) => {
      const remaining = prevCommittee.filter((c) => {
        const idMatches = c.id === memberId || (targetMember && (c.id === targetMember.id || c.id === targetMember.memberId));
        const nameMatches = Boolean(
          targetMember?.name && c.name && c.name.trim().toLowerCase() === targetMember.name.trim().toLowerCase()
        );
        const phoneMatches = Boolean(
          targetMember?.phone &&
          c.phone &&
          c.phone.replace(/\D/g, "").length >= 6 &&
          targetMember.phone.replace(/\D/g, "").includes(c.phone.replace(/\D/g, ""))
        );
        return !idMatches && !nameMatches && !phoneMatches;
      });

      if (remaining.length !== prevCommittee.length) {
        saveCommitteeOnline(remaining).catch((err) =>
          console.error("Failed to sync committee after member deletion:", err)
        );
      }
      return remaining;
    });

    // 3. Delete permanently from Firestore database
    try {
      await deleteMemberOnline(memberId, targetMember);
    } catch (e) {
      console.error("Online member delete error:", e);
    }
  };

  // Admin updates notifications online across multiple devices
  const handleSetNotifications = (newNotifs: React.SetStateAction<AppNotification[]>) => {
    setNotifications((prev) => {
      const resolved = typeof newNotifs === "function" ? newNotifs(prev) : newNotifs;
      saveNotificationsOnline(resolved).catch((err) =>
        console.error("Failed to sync notifications online:", err)
      );
      return resolved;
    });
  };

  // Admin updates advertisements online across multiple devices
  const handleSetAdvertisements = (newAds: React.SetStateAction<AdvertisementSlide[]>) => {
    setAdvertisements((prev) => {
      const resolved = typeof newAds === "function" ? newAds(prev) : newAds;
      saveAdvertisementsOnline(resolved).catch((err) =>
        console.error("Failed to sync ads online:", err)
      );
      return resolved;
    });
  };

  // Admin updates committee members online across multiple devices
  const handleSetCommittee = (newCommittee: React.SetStateAction<ExecutiveMember[]>) => {
    setCommittee((prev) => {
      const resolved = typeof newCommittee === "function" ? newCommittee(prev) : newCommittee;
      saveCachedCommittee(resolved);
      saveCommitteeOnline(resolved).catch((err) =>
        console.error("Failed to sync committee online:", err)
      );
      return resolved;
    });
  };

  const handleDeleteCommitteeMember = async (id: string, name?: string) => {
    setCommittee((prev) => {
      const resolved = prev.filter((c) => c.id !== id);
      saveCachedCommittee(resolved);
      return resolved;
    });
    try {
      await deleteCommitteeMemberOnline(id, name);
    } catch (err) {
      console.error("Failed to sync committee delete online:", err);
    }
  };

  const handleOpenMemberIdCard = (member: Member) => {
    setSelectedMemberForIdCard(member);
  };

  const handleConfirmClose = () => {
    setCloseConfirmModalOpen(false);
    setIsAppClosed(true);
    try {
      window.close();
    } catch {
      // restricted in iframe
    }
  };

  // If application is in closed state, render resting screen
  if (isAppClosed) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md w-full bg-stone-900 border border-amber-600/40 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="flex justify-center">
            <LogoEmblem size="lg" showRegistrationBadge={false} />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-amber-200">
              Application Closed
            </h1>
            <p className="text-xs text-stone-400 leading-relaxed">
              You have closed the Kollam District Maratha Welfare Association Portal session.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setIsAppClosed(false);
                setActiveTab("home");
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-lg transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Launch / Re-Open Portal</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRegisterModal={() => setRegisterModalOpen(true)}
        onOpenIdCardModal={() => {
          if (currentUser.role === "member" && currentUser.member) {
            setSelectedMemberForIdCard(currentUser.member);
          } else {
            setSelectedMemberForIdCard(members[0] || null);
          }
        }}
        onOpenAdminPanel={() => setActiveTab("admin")}
        onCloseApp={() => setCloseConfirmModalOpen(true)}
        currentUser={currentUser}
        onOpenLoginModal={() => setMemberLoginModalOpen(true)}
        onLogout={handleLogout}
        onChangePasscode={() => setChangeMemberPasscodeModalOpen(true)}
        onEditProfile={() => {
          if (currentUser.role === "member" && currentUser.member) {
            setEditingProfileMember(currentUser.member);
          }
        }}
      />

      {/* Main Container */}
      <main className={`flex-1 max-w-7xl w-full mx-auto px-4 ${activeTab === "home" ? "pt-2 pb-6" : "py-6"}`}>
        {/* HOME PAGE */}
        {activeTab === "home" && (
          <HomePageView
            notifications={notifications}
            advertisements={advertisements}
            goldRates={goldRates}
            onOpenAdminPanel={() => setActiveTab("admin")}
            setActiveTab={setActiveTab}
          />
        )}

        {/* MEMBER DIRECTORY */}
        {activeTab === "members" && (
          <MemberDirectory
            members={members}
            onSelectMemberForIdCard={handleOpenMemberIdCard}
            onOpenRegisterModal={() => setRegisterModalOpen(true)}
            currentUser={currentUser}
            onOpenLoginModal={() => setMemberLoginModalOpen(true)}
            onEditMemberProfile={(member) => setEditingProfileMember(member)}
          />
        )}

        {/* LIVE GOLD RATES */}
        {activeTab === "gold-rates" && (
          <GoldRatesView
            goldRates={goldRates}
            goldPromos={goldPromos}
            onOpenAdminPanel={() => setActiveTab("admin")}
            currentUser={currentUser}
          />
        )}

        {/* COMMITTEE MEMBERS */}
        {activeTab === "committee" && (
          <ExecutiveCommitteeView
            committee={committee}
            currentUser={currentUser}
            onDeleteCommitteeMember={handleDeleteCommitteeMember}
            onOpenAdminPanel={() => setActiveTab("admin")}
          />
        )}

        {/* EVENTS & GALLERY */}
        {activeTab === "events" && (
          <EventsAnnouncementsView
            events={events}
            gallery={gallery}
            members={members}
            onOpenBirthdayView={() => setActiveTab("birthday")}
          />
        )}

        {/* MEMBER BIRTHDAYS */}
        {activeTab === "birthday" && (
          <BirthdayView members={members} />
        )}

        {/* ADMIN PANEL */}
        {activeTab === "admin" && (
          <AdminPanelModal
            onClose={() => setActiveTab("home")}
            onGoHome={() => setActiveTab("home")}
            notifications={notifications}
            setNotifications={handleSetNotifications}
            advertisements={advertisements}
            setAdvertisements={handleSetAdvertisements}
            pendingMembers={pendingMembers}
            onApproveMember={handleApproveMember}
            onRejectMember={handleRejectMember}
            onUpdateMemberDetails={handleUpdatePendingMemberDetails}
            members={members}
            committee={committee}
            setCommittee={handleSetCommittee}
            onDeleteCommitteeMemberOnline={handleDeleteCommitteeMember}
            events={events}
            setEvents={setEvents}
            gallery={gallery}
            setGallery={setGallery}
            onSaveEventOnline={saveSingleEventOnline}
            onDeleteEventOnline={deleteEventOnline}
            onSaveGalleryItemOnline={saveSingleGalleryItemOnline}
            onDeleteGalleryItemOnline={deleteGalleryItemOnline}
            goldRates={goldRates}
            setGoldRates={setGoldRates}
            onSaveGoldRatesOnline={saveGoldRatesOnline}
            goldPromos={goldPromos}
            setGoldPromos={setGoldPromos}
            onSaveGoldPromosOnline={saveGoldPromosOnline}
            currentUser={currentUser}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
            onAddMemberDirectly={handleAddMemberDirectly}
            onAdminLoginSuccess={(adminUser) => setCurrentUser(adminUser)}
            adminPasscode={adminPasscode}
            onSaveAdminPasscodeOnline={saveAdminPasscodeOnline}
            onAdminResetMemberPasscode={resetMemberPasscodeOnline}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenRegisterModal={() => setRegisterModalOpen(true)}
        onOpenIdCardModal={() => {
          if (currentUser.role === "member" && currentUser.member) {
            setSelectedMemberForIdCard(currentUser.member);
          } else {
            setSelectedMemberForIdCard(members[0] || null);
          }
        }}
        onOpenAdminPanel={() => setActiveTab("admin")}
      />

      {/* Digital ID Card Modal */}
      {selectedMemberForIdCard && (
        <DigitalIDCardModal
          member={selectedMemberForIdCard}
          onClose={() => setSelectedMemberForIdCard(null)}
          currentUser={currentUser}
          onOpenLoginModal={() => setMemberLoginModalOpen(true)}
        />
      )}

      {/* Member Login Modal */}
      <MemberLoginModal
        isOpen={memberLoginModalOpen}
        onClose={() => setMemberLoginModalOpen(false)}
        members={members}
        onLoginSuccess={handleLoginSuccess}
        adminPasscode={adminPasscode}
        onOpenRegisterModal={() => {
          setMemberLoginModalOpen(false);
          setRegisterModalOpen(true);
        }}
        onOpenAdminLogin={() => {
          setMemberLoginModalOpen(false);
          setActiveTab("admin");
        }}
      />

      {/* First Login: Prompt Member to Create New 4-Digit Passcode */}
      {currentUser.role === "member" &&
        currentUser.member &&
        (!currentUser.member.hasChangedPasscode ||
          (currentUser.member.password || "1234") === "1234") && (
          <CreateNewPasscodeModal
            isOpen={true}
            member={currentUser.member}
            onSaveNewPasscode={handleSaveNewPasscode}
          />
        )}

      {/* Member Initiated Passcode Change Modal */}
      {changeMemberPasscodeModalOpen &&
        currentUser.role === "member" &&
        currentUser.member && (
          <ChangeMemberPasscodeModal
            isOpen={changeMemberPasscodeModalOpen}
            onClose={() => setChangeMemberPasscodeModalOpen(false)}
            member={currentUser.member}
            onSaveNewPasscode={handleExplicitMemberChangePasscode}
          />
        )}

      {/* Member Profile & Photo Edit Modal */}
      {editingProfileMember && (
        <EditMemberProfileModal
          isOpen={Boolean(editingProfileMember)}
          member={editingProfileMember}
          onClose={() => setEditingProfileMember(null)}
          onSave={handleSaveMemberProfile}
        />
      )}

      {/* Online Registration Modal */}
      {registerModalOpen && (
        <MembershipRegistrationModal
          onClose={() => setRegisterModalOpen(false)}
          onAddMember={handleAddMember}
        />
      )}

      {/* Close App Confirmation Dialog */}
      {closeConfirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-red-500/40 rounded-2xl max-w-sm w-full p-6 text-stone-100 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-red-950 text-red-400 border border-red-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-100">
                  Close Application
                </h3>
                <p className="text-xs text-stone-400">Exit Portal Session</p>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Are you sure you want to close the Kollam District Maratha Welfare Association Portal?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setCloseConfirmModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClose}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-all"
              >
                <Power className="w-3.5 h-3.5" />
                <span>Exit App</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



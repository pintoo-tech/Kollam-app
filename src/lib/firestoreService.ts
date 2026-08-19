import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  Member,
  AppNotification,
  AdvertisementSlide,
  ExecutiveMember,
  GoldRates,
  GoldRatePromo,
  AssociationEvent,
  GalleryItem,
} from "../types";
import { ensureSafeImagePayload } from "./imageCompressor";
import {
  INITIAL_NOTIFICATIONS,
  INITIAL_ADVERTISEMENTS,
  INITIAL_GOLD_RATES,
  INITIAL_GOLD_PROMOS,
  ASSOCIATION_EVENTS,
  GALLERY_ITEMS,
} from "../data/kollamData";

// Collection Names
const COL_MEMBERS = "members";
const COL_PENDING = "pending_members";
const COL_NOTIFICATIONS = "notifications";
const COL_ADVERTISEMENTS = "advertisements";
const COL_COMMITTEE = "committee_members";
const COL_SETTINGS = "app_settings";
const COL_GOLD_PROMOS = "gold_promos";
const COL_EVENTS = "events";
const COL_GALLERY = "gallery";
const DOC_GOLD_RATES = "gold_rates";
const DOC_INIT_STATUS = "system_meta";
const DOC_ADMIN_CONFIG = "admin_config";

// Local cache keys
const LOCAL_ACTIVE_MEMBERS_KEY = "kollam_active_members_cache";
const LOCAL_PENDING_MEMBERS_KEY = "kollam_pending_members_cache";
const LOCAL_ADMIN_PASSCODE_KEY = "kollam_admin_passcode";
const LOCAL_COMMITTEE_KEY = "kollam_committee_cache";
const LOCAL_EVENTS_KEY = "kollam_events_cache";
const LOCAL_GALLERY_KEY = "kollam_gallery_cache";

/**
 * Strips undefined values recursively so Firestore setDoc never rejects the payload
 */
export function sanitizeForFirestore<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== "object") return obj;
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value !== null && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
        clean[key] = sanitizeForFirestore(value);
      } else {
        clean[key] = value;
      }
    }
  }
  return clean as T;
}

export function getCachedActiveMembers(): Member[] {
  try {
    const saved = localStorage.getItem(LOCAL_ACTIVE_MEMBERS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveCachedActiveMembers(members: Member[]) {
  try {
    localStorage.setItem(LOCAL_ACTIVE_MEMBERS_KEY, JSON.stringify(members));
  } catch {
    // ignore
  }
}

export function getCachedPendingMembers(): Member[] {
  try {
    const saved = localStorage.getItem(LOCAL_PENDING_MEMBERS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveCachedPendingMembers(pending: Member[]) {
  try {
    localStorage.setItem(LOCAL_PENDING_MEMBERS_KEY, JSON.stringify(pending));
  } catch {
    // ignore
  }
}

export function getCachedCommittee(): ExecutiveMember[] {
  try {
    const saved = localStorage.getItem(LOCAL_COMMITTEE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveCachedCommittee(committee: ExecutiveMember[]) {
  try {
    localStorage.setItem(LOCAL_COMMITTEE_KEY, JSON.stringify(committee));
  } catch {
    // ignore
  }
}

export function getCachedEvents(): AssociationEvent[] {
  try {
    const saved = localStorage.getItem(LOCAL_EVENTS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveCachedEvents(events: AssociationEvent[]) {
  try {
    localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(events));
  } catch {
    // ignore
  }
}

export function getCachedGallery(): GalleryItem[] {
  try {
    const saved = localStorage.getItem(LOCAL_GALLERY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveCachedGallery(gallery: GalleryItem[]) {
  try {
    localStorage.setItem(LOCAL_GALLERY_KEY, JSON.stringify(gallery));
  } catch {
    // ignore
  }
}

/**
 * Admin Passcode Management (Synced with Firestore & localStorage)
 */
export function getLocalAdminPasscode(): string {
  try {
    return localStorage.getItem(LOCAL_ADMIN_PASSCODE_KEY) || "2026";
  } catch {
    return "2026";
  }
}

export async function saveAdminPasscodeOnline(newPasscode: string): Promise<void> {
  const clean = newPasscode.trim() || "2026";
  try {
    localStorage.setItem(LOCAL_ADMIN_PASSCODE_KEY, clean);
    await setDoc(
      doc(db, COL_SETTINGS, DOC_ADMIN_CONFIG),
      sanitizeForFirestore({
        adminPasscode: clean,
        updatedAt: new Date().toISOString(),
      }),
      { merge: true }
    );
  } catch (err) {
    console.error("Error saving admin passcode online:", err);
  }
}

export function subscribeToAdminPasscode(callback: (passcode: string) => void) {
  return onSnapshot(
    doc(db, COL_SETTINGS, DOC_ADMIN_CONFIG),
    (docSnap) => {
      if (docSnap.exists() && docSnap.data()?.adminPasscode) {
        const pass = String(docSnap.data()?.adminPasscode).trim();
        try {
          localStorage.setItem(LOCAL_ADMIN_PASSCODE_KEY, pass);
        } catch {}
        callback(pass);
      } else {
        callback(getLocalAdminPasscode());
      }
    },
    (err) => {
      console.warn("Could not listen to admin passcode, using local:", err);
      callback(getLocalAdminPasscode());
    }
  );
}

/**
 * Initialize Firestore base settings and notifications if database is fresh
 */
export async function initializeFirestoreDataIfEmpty() {
  try {
    const initMetaDoc = await getDoc(doc(db, COL_SETTINGS, DOC_INIT_STATUS));
    const isAlreadyInitialized = initMetaDoc.exists() && initMetaDoc.data()?.initialized;

    if (!isAlreadyInitialized) {
      const notifSnap = await getDocs(collection(db, COL_NOTIFICATIONS));
      if (notifSnap.empty) {
        for (const n of INITIAL_NOTIFICATIONS) {
          await setDoc(doc(db, COL_NOTIFICATIONS, n.id), sanitizeForFirestore(n));
        }
      }

      const adSnap = await getDocs(collection(db, COL_ADVERTISEMENTS));
      if (adSnap.empty) {
        for (const a of INITIAL_ADVERTISEMENTS) {
          await setDoc(doc(db, COL_ADVERTISEMENTS, a.id), sanitizeForFirestore(a));
        }
      }

      const settingsSnap = await getDocs(collection(db, COL_SETTINGS));
      if (settingsSnap.empty) {
        await setDoc(doc(db, COL_SETTINGS, DOC_GOLD_RATES), sanitizeForFirestore(INITIAL_GOLD_RATES));
      }

      const promoSnap = await getDocs(collection(db, COL_GOLD_PROMOS));
      if (promoSnap.empty) {
        for (const p of INITIAL_GOLD_PROMOS) {
          await setDoc(doc(db, COL_GOLD_PROMOS, p.id), sanitizeForFirestore(p));
        }
      }

      const eventsSnap = await getDocs(collection(db, COL_EVENTS));
      if (eventsSnap.empty) {
        for (const e of ASSOCIATION_EVENTS) {
          await setDoc(doc(db, COL_EVENTS, e.id), sanitizeForFirestore(e));
        }
      }

      const gallerySnap = await getDocs(collection(db, COL_GALLERY));
      if (gallerySnap.empty) {
        for (const g of GALLERY_ITEMS) {
          await setDoc(doc(db, COL_GALLERY, g.id), sanitizeForFirestore(g));
        }
      }

      await setDoc(
        doc(db, COL_SETTINGS, DOC_INIT_STATUS),
        {
          initialized: true,
          initializedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
  } catch (err) {
    console.error("Error checking or seeding initial Firestore meta:", err);
  }
}

/**
 * Subscribe to Real-Time Members across all devices & sessions
 */
export function subscribeToMembers(callback: (members: Member[]) => void) {
  return onSnapshot(
    collection(db, COL_MEMBERS),
    (snapshot) => {
      const list: Member[] = [];
      snapshot.forEach((docSnap) => {
        const m = docSnap.data() as Member;
        if (m && m.name) {
          list.push({ ...m, id: m.id || docSnap.id });
        }
      });
      saveCachedActiveMembers(list);
      callback(list);
    },
    (err) => {
      console.error("Error listening to members from Firestore:", err);
      const cached = getCachedActiveMembers();
      callback(cached || []);
    }
  );
}

/**
 * Subscribe to Real-Time Pending Members (for Admin Approval)
 */
export function subscribeToPendingMembers(callback: (pending: Member[]) => void) {
  return onSnapshot(
    collection(db, COL_PENDING),
    (snapshot) => {
      const list: Member[] = [];
      snapshot.forEach((docSnap) => {
        const m = docSnap.data() as Member;
        if (m && m.name) {
          list.push({ ...m, id: m.id || docSnap.id });
        }
      });
      saveCachedPendingMembers(list);
      callback(list);
    },
    (err) => {
      console.error("Error listening to pending members from Firestore:", err);
      const cached = getCachedPendingMembers();
      callback(cached || []);
    }
  );
}

/**
 * Subscribe to Real-Time Notifications
 */
export function subscribeToNotifications(callback: (notifs: AppNotification[]) => void) {
  return onSnapshot(
    collection(db, COL_NOTIFICATIONS),
    (snapshot) => {
      if (!snapshot.empty) {
        const list: AppNotification[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as AppNotification);
        });
        callback(list);
      } else {
        callback(INITIAL_NOTIFICATIONS);
      }
    },
    (err) => {
      console.error("Error listening to notifications:", err);
    }
  );
}

/**
 * Subscribe to Real-Time Advertisements
 */
export function subscribeToAdvertisements(callback: (ads: AdvertisementSlide[]) => void) {
  return onSnapshot(
    collection(db, COL_ADVERTISEMENTS),
    (snapshot) => {
      if (!snapshot.empty) {
        const list: AdvertisementSlide[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as AdvertisementSlide);
        });
        callback(list);
      } else {
        callback(INITIAL_ADVERTISEMENTS);
      }
    },
    (err) => {
      console.error("Error listening to advertisements:", err);
    }
  );
}

// Data mutation helpers synced directly with Firestore & local cache
export async function saveMemberOnline(member: Member): Promise<void> {
  const memberId = member.id || member.memberId || `mem-${Date.now()}`;
  const safeAvatar = await ensureSafeImagePayload(member.avatarUrl);
  const toSave: Member = sanitizeForFirestore({
    ...member,
    id: memberId,
    avatarUrl: safeAvatar,
    status: member.status || "Active",
  });

  // Update local cache immediately
  const cached = getCachedActiveMembers();
  const updated = [toSave, ...cached.filter((m) => m.id !== toSave.id && m.memberId !== toSave.memberId)];
  saveCachedActiveMembers(updated);

  try {
    await setDoc(doc(db, COL_MEMBERS, toSave.id), toSave);
    console.log("Member successfully saved permanently to cloud Firestore:", toSave.id, toSave.name);
  } catch (err) {
    console.error("Error saving member to Firestore cloud:", err);
    throw err;
  }
}

export async function deleteMemberOnline(memberId: string, memberInfo?: Partial<Member>): Promise<void> {
  // Update local cache
  const cached = getCachedActiveMembers();
  const updated = cached.filter(
    (m) => m.id !== memberId && m.memberId !== memberId && (!memberInfo?.id || m.id !== memberInfo.id)
  );
  saveCachedActiveMembers(updated);

  // 1. Direct document deletion from members collection
  try {
    await deleteDoc(doc(db, COL_MEMBERS, memberId));
  } catch (err) {
    console.error("Error deleting doc by memberId:", err);
  }

  if (memberInfo?.id && memberInfo.id !== memberId) {
    try {
      await deleteDoc(doc(db, COL_MEMBERS, memberInfo.id));
    } catch {}
  }

  if (memberInfo?.memberId && memberInfo.memberId !== memberId) {
    try {
      await deleteDoc(doc(db, COL_MEMBERS, memberInfo.memberId));
    } catch {}
  }

  // 2. Query any remaining documents in members collection matching id or memberId
  try {
    const memSnap = await getDocs(collection(db, COL_MEMBERS));
    for (const d of memSnap.docs) {
      const data = d.data() as Member;
      if (
        d.id === memberId ||
        data.id === memberId ||
        data.memberId === memberId ||
        (memberInfo?.memberId && data.memberId === memberInfo.memberId)
      ) {
        await deleteDoc(doc(db, COL_MEMBERS, d.id));
      }
    }
  } catch (err) {
    console.error("Error scanning members for deletion:", err);
  }

  // 3. Cascade Delete: Check and remove from Committee Members collection in Firestore
  try {
    const commSnap = await getDocs(collection(db, COL_COMMITTEE));
    for (const cd of commSnap.docs) {
      const cData = cd.data() as ExecutiveMember;
      const idMatches = cd.id === memberId || cData.id === memberId || (memberInfo?.id && cData.id === memberInfo.id);
      const nameMatches =
        Boolean(memberInfo?.name && cData.name && cData.name.trim().toLowerCase() === memberInfo.name.trim().toLowerCase());
      const phoneMatches =
        Boolean(memberInfo?.phone &&
        cData.phone &&
        cData.phone.replace(/\D/g, "").length >= 6 &&
        memberInfo.phone.replace(/\D/g, "").includes(cData.phone.replace(/\D/g, "")));

      if (idMatches || nameMatches || phoneMatches) {
        await deleteDoc(doc(db, COL_COMMITTEE, cd.id));
      }
    }
  } catch (commErr) {
    console.error("Error cascading committee deletion:", commErr);
  }
}

export async function submitPendingMemberOnline(member: Member): Promise<void> {
  const pendingId = member.id || `pending-${Date.now()}`;
  const safeAvatar = await ensureSafeImagePayload(member.avatarUrl);
  const toSave: Member = sanitizeForFirestore({
    ...member,
    id: pendingId,
    avatarUrl: safeAvatar,
    status: "Pending Approval" as const,
  });

  const cachedPending = getCachedPendingMembers();
  saveCachedPendingMembers([toSave, ...cachedPending.filter((m) => m.id !== toSave.id)]);

  try {
    await setDoc(doc(db, COL_PENDING, toSave.id), toSave);
    console.log("Pending member application saved permanently to cloud Firestore:", toSave.id, toSave.name);
  } catch (err) {
    console.error("Error submitting pending member to Firestore cloud:", err);
    throw err;
  }
}

export async function approveMemberOnline(member: Member): Promise<void> {
  const memberId = member.id || `mem-${Date.now()}`;
  const safeAvatar = await ensureSafeImagePayload(member.avatarUrl);
  const approved: Member = sanitizeForFirestore({
    ...member,
    id: memberId,
    avatarUrl: safeAvatar,
    status: "Active",
    roll: member.roll || "सदस्य",
  });

  // Immediate local cache update
  const cachedActive = getCachedActiveMembers();
  const updatedActive = [approved, ...cachedActive.filter((m) => m.id !== approved.id && m.memberId !== approved.memberId)];
  saveCachedActiveMembers(updatedActive);

  const cachedPending = getCachedPendingMembers();
  saveCachedPendingMembers(cachedPending.filter((m) => m.id !== member.id && m.memberId !== member.memberId));

  try {
    await setDoc(doc(db, COL_MEMBERS, approved.id), approved);
    console.log("Approved member written permanently to cloud Firestore:", approved.id, approved.name);
  } catch (err) {
    console.error("Error saving approved member to Firestore cloud:", err);
    throw err;
  }

  try {
    await deleteDoc(doc(db, COL_PENDING, member.id));
  } catch (e) {
    console.warn("Could not delete from pending, might already be removed:", e);
  }
}

export async function updateMemberOnline(member: Member): Promise<void> {
  const safeAvatar = await ensureSafeImagePayload(member.avatarUrl);
  const toSave: Member = sanitizeForFirestore({
    ...member,
    avatarUrl: safeAvatar,
  });

  // Update active cache
  const cachedActive = getCachedActiveMembers();
  const updatedActive = cachedActive.map((m) => (m.id === toSave.id ? toSave : m));
  saveCachedActiveMembers(updatedActive);

  try {
    await setDoc(doc(db, COL_MEMBERS, member.id), toSave);
    console.log("Member updated in Firestore cloud:", member.id, member.name);
  } catch (err) {
    console.error("Error updating member in Firestore cloud:", err);
    throw err;
  }
}

export async function resetMemberPasscodeOnline(memberId: string, newPasscode: string): Promise<void> {
  const cleanPasscode = newPasscode.trim() || "1234";
  try {
    const memRef = doc(db, COL_MEMBERS, memberId);
    await updateDoc(memRef, {
      password: cleanPasscode,
      hasChangedPasscode: false,
    });

    const cachedActive = getCachedActiveMembers();
    const updatedActive = cachedActive.map((m) =>
      m.id === memberId || m.memberId === memberId
        ? { ...m, password: cleanPasscode, hasChangedPasscode: false }
        : m
    );
    saveCachedActiveMembers(updatedActive);
  } catch (err) {
    console.error("Error resetting member passcode online:", err);
  }
}

export async function updateMemberPasscodeOnline(memberId: string, newPasscode: string): Promise<void> {
  const cleanPasscode = newPasscode.trim();
  try {
    const memRef = doc(db, COL_MEMBERS, memberId);
    await updateDoc(memRef, {
      password: cleanPasscode,
      hasChangedPasscode: true,
    });

    const cachedActive = getCachedActiveMembers();
    const updatedActive = cachedActive.map((m) =>
      m.id === memberId || m.memberId === memberId
        ? { ...m, password: cleanPasscode, hasChangedPasscode: true }
        : m
    );
    saveCachedActiveMembers(updatedActive);
  } catch (err) {
    console.error("Error updating member passcode online:", err);
  }
}

export async function rejectPendingMemberOnline(memberId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COL_PENDING, memberId));
  } catch (err) {
    console.error("Error deleting pending member from Firestore cloud:", err);
  }
}

export async function updatePendingMemberDetailsOnline(updatedMember: Member): Promise<void> {
  const safeAvatar = await ensureSafeImagePayload(updatedMember.avatarUrl);
  const toSave = sanitizeForFirestore({ ...updatedMember, avatarUrl: safeAvatar });
  try {
    await setDoc(doc(db, COL_PENDING, updatedMember.id), toSave);
  } catch (err) {
    console.error("Error updating pending member in Firestore cloud:", err);
  }
}

export async function saveNotificationsOnline(notifs: AppNotification[]): Promise<void> {
  for (const n of notifs) {
    const safeImg = await ensureSafeImagePayload(n.imageUrl);
    const toSave = sanitizeForFirestore({ ...n, imageUrl: safeImg });
    await setDoc(doc(db, COL_NOTIFICATIONS, n.id), toSave);
  }
}

export async function deleteNotificationOnline(notifId: string): Promise<void> {
  await deleteDoc(doc(db, COL_NOTIFICATIONS, notifId));
}

export async function saveAdvertisementsOnline(ads: AdvertisementSlide[]): Promise<void> {
  for (const a of ads) {
    const safeImg = await ensureSafeImagePayload(a.imageUrl);
    const toSave = sanitizeForFirestore({ ...a, imageUrl: safeImg });
    await setDoc(doc(db, COL_ADVERTISEMENTS, a.id), toSave);
  }
}

export function subscribeToCommittee(callback: (committee: ExecutiveMember[]) => void) {
  return onSnapshot(
    collection(db, COL_COMMITTEE),
    (snapshot) => {
      const list: ExecutiveMember[] = [];
      snapshot.forEach((docSnap) => {
        const c = docSnap.data() as ExecutiveMember;
        if (c && c.name) {
          list.push({ ...c, id: c.id || docSnap.id });
        }
      });
      list.sort((a, b) => (Number(a.priority) || 99) - (Number(b.priority) || 99));
      saveCachedCommittee(list);
      callback(list);
    },
    (err) => {
      console.error("Error listening to committee:", err);
      const cached = getCachedCommittee();
      callback(cached);
    }
  );
}

export async function saveCommitteeOnline(committee: ExecutiveMember[]): Promise<void> {
  saveCachedCommittee(committee);

  // 1. Clean up removed committee member documents from Firestore
  try {
    const currentIds = new Set(committee.map((c) => c.id));
    const snap = await getDocs(collection(db, COL_COMMITTEE));
    for (const d of snap.docs) {
      const dData = d.data() as ExecutiveMember;
      if (!currentIds.has(d.id) && !currentIds.has(dData?.id)) {
        await deleteDoc(doc(db, COL_COMMITTEE, d.id));
      }
    }
  } catch (err) {
    console.error("Error cleaning up removed committee members in Firestore:", err);
  }

  // 2. Save active committee members
  for (const c of committee) {
    const safeImg = await ensureSafeImagePayload(c.photoUrl);
    const toSave = sanitizeForFirestore({ ...c, photoUrl: safeImg });
    await setDoc(doc(db, COL_COMMITTEE, c.id), toSave);
  }
}

export async function deleteCommitteeMemberOnline(id: string, name?: string): Promise<void> {
  // Update local cache immediately
  const cached = getCachedCommittee();
  const updated = cached.filter(
    (c) => c.id !== id && (!name || c.name.trim().toLowerCase() !== name.trim().toLowerCase())
  );
  saveCachedCommittee(updated);

  // 1. Direct delete
  try {
    await deleteDoc(doc(db, COL_COMMITTEE, id));
  } catch (err) {
    console.error("Error deleting committee member by ID:", err);
  }

  // 2. Query scan to clean up any duplicate or orphaned documents
  try {
    const snap = await getDocs(collection(db, COL_COMMITTEE));
    for (const d of snap.docs) {
      const data = d.data() as ExecutiveMember;
      const matchesId = d.id === id || data?.id === id;
      const matchesName = Boolean(
        name && data?.name && data.name.trim().toLowerCase() === name.trim().toLowerCase()
      );
      if (matchesId || matchesName) {
        await deleteDoc(doc(db, COL_COMMITTEE, d.id));
      }
    }
  } catch (err) {
    console.error("Error scanning committee to delete:", err);
  }
}

/**
 * Subscribe to Real-Time Live Gold Rates across all devices
 */
export function subscribeToGoldRates(callback: (rates: GoldRates) => void) {
  return onSnapshot(
    doc(db, COL_SETTINGS, DOC_GOLD_RATES),
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as GoldRates);
      } else {
        callback(INITIAL_GOLD_RATES);
      }
    },
    (err) => {
      console.error("Error listening to gold rates:", err);
    }
  );
}

export async function saveGoldRatesOnline(rates: GoldRates): Promise<void> {
  await setDoc(doc(db, COL_SETTINGS, DOC_GOLD_RATES), sanitizeForFirestore(rates));
}

/**
 * Subscribe to Real-Time 4x6 Gold Rate Promo Posters across all devices
 */
export function subscribeToGoldPromos(callback: (promos: GoldRatePromo[]) => void) {
  return onSnapshot(
    collection(db, COL_GOLD_PROMOS),
    (snapshot) => {
      if (!snapshot.empty) {
        const list: GoldRatePromo[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as GoldRatePromo);
        });
        list.sort((a, b) => a.id.localeCompare(b.id));
        callback(list);
      } else {
        callback(INITIAL_GOLD_PROMOS);
      }
    },
    (err) => {
      console.error("Error listening to gold promos:", err);
    }
  );
}

export async function saveGoldPromosOnline(promos: GoldRatePromo[]): Promise<void> {
  for (const p of promos) {
    const safeImage = await ensureSafeImagePayload(p.imageUrl);
    await setDoc(
      doc(db, COL_GOLD_PROMOS, p.id),
      sanitizeForFirestore({
        id: p.id,
        title: p.title || "",
        subtitle: p.subtitle || "",
        imageUrl: safeImage,
      })
    );
  }
}

/**
 * Subscribe to Real-Time Association Events
 */
export function subscribeToEvents(callback: (events: AssociationEvent[]) => void) {
  return onSnapshot(
    collection(db, COL_EVENTS),
    (snapshot) => {
      const list: AssociationEvent[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as AssociationEvent;
        if (data && data.title) {
          list.push({ ...data, id: data.id || docSnap.id });
        }
      });
      saveCachedEvents(list);
      callback(list);
    },
    (err) => {
      console.error("Error listening to events:", err);
      const cached = getCachedEvents();
      callback(cached);
    }
  );
}

export async function saveEventsOnline(events: AssociationEvent[]): Promise<void> {
  saveCachedEvents(events);

  // Clean up any deleted events in Firestore
  try {
    const currentIds = new Set(events.map((e) => e.id));
    const snap = await getDocs(collection(db, COL_EVENTS));
    for (const d of snap.docs) {
      const dData = d.data() as AssociationEvent;
      if (!currentIds.has(d.id) && !currentIds.has(dData?.id)) {
        await deleteDoc(doc(db, COL_EVENTS, d.id));
      }
    }
  } catch (err) {
    console.error("Error cleaning up deleted events in Firestore:", err);
  }

  for (const evt of events) {
    const safeImg = await ensureSafeImagePayload(evt.imageUrl);
    const toSave = sanitizeForFirestore({ ...evt, imageUrl: safeImg });
    await setDoc(doc(db, COL_EVENTS, evt.id), toSave);
  }
}

export async function saveSingleEventOnline(event: AssociationEvent): Promise<void> {
  const cached = getCachedEvents();
  const updated = [event, ...cached.filter((e) => e.id !== event.id)];
  saveCachedEvents(updated);

  const safeImg = await ensureSafeImagePayload(event.imageUrl);
  const toSave = sanitizeForFirestore({ ...event, imageUrl: safeImg });
  await setDoc(doc(db, COL_EVENTS, event.id), toSave);
}

export async function deleteEventOnline(eventId: string, title?: string): Promise<void> {
  // Update local cache immediately
  const cached = getCachedEvents();
  const updated = cached.filter(
    (e) => e.id !== eventId && (!title || e.title.trim().toLowerCase() !== title.trim().toLowerCase())
  );
  saveCachedEvents(updated);

  // 1. Direct delete
  try {
    await deleteDoc(doc(db, COL_EVENTS, eventId));
  } catch (err) {
    console.error("Error deleting event by ID:", err);
  }

  // 2. Query scan to clean up matching docs
  try {
    const snap = await getDocs(collection(db, COL_EVENTS));
    for (const d of snap.docs) {
      const data = d.data() as AssociationEvent;
      const matchesId = d.id === eventId || data?.id === eventId;
      const matchesTitle = Boolean(
        title && data?.title && data.title.trim().toLowerCase() === title.trim().toLowerCase()
      );
      if (matchesId || matchesTitle) {
        await deleteDoc(doc(db, COL_EVENTS, d.id));
      }
    }
  } catch (err) {
    console.error("Error scanning events to delete:", err);
  }
}

/**
 * Subscribe to Real-Time Media Gallery Items
 */
export function subscribeToGallery(callback: (gallery: GalleryItem[]) => void) {
  return onSnapshot(
    collection(db, COL_GALLERY),
    (snapshot) => {
      const list: GalleryItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as GalleryItem;
        if (data && data.title) {
          list.push({ ...data, id: data.id || docSnap.id });
        }
      });
      saveCachedGallery(list);
      callback(list);
    },
    (err) => {
      console.error("Error listening to gallery:", err);
      const cached = getCachedGallery();
      callback(cached);
    }
  );
}

export async function saveGalleryOnline(gallery: GalleryItem[]): Promise<void> {
  saveCachedGallery(gallery);

  try {
    const currentIds = new Set(gallery.map((g) => g.id));
    const snap = await getDocs(collection(db, COL_GALLERY));
    for (const d of snap.docs) {
      const dData = d.data() as GalleryItem;
      if (!currentIds.has(d.id) && !currentIds.has(dData?.id)) {
        await deleteDoc(doc(db, COL_GALLERY, d.id));
      }
    }
  } catch (err) {
    console.error("Error cleaning up deleted gallery items in Firestore:", err);
  }

  for (const g of gallery) {
    const safeImg = await ensureSafeImagePayload(g.imageUrl);
    const toSave = sanitizeForFirestore({ ...g, imageUrl: safeImg });
    await setDoc(doc(db, COL_GALLERY, g.id), toSave);
  }
}

export async function saveSingleGalleryItemOnline(item: GalleryItem): Promise<void> {
  const cached = getCachedGallery();
  const updated = [item, ...cached.filter((g) => g.id !== item.id)];
  saveCachedGallery(updated);

  const safeImg = await ensureSafeImagePayload(item.imageUrl);
  const toSave = sanitizeForFirestore({ ...item, imageUrl: safeImg });
  await setDoc(doc(db, COL_GALLERY, item.id), toSave);
}

export async function deleteGalleryItemOnline(galleryId: string, title?: string): Promise<void> {
  const cached = getCachedGallery();
  const updated = cached.filter(
    (g) => g.id !== galleryId && (!title || g.title.trim().toLowerCase() !== title.trim().toLowerCase())
  );
  saveCachedGallery(updated);

  try {
    await deleteDoc(doc(db, COL_GALLERY, galleryId));
  } catch (err) {
    console.error("Error deleting gallery item by ID:", err);
  }

  try {
    const snap = await getDocs(collection(db, COL_GALLERY));
    for (const d of snap.docs) {
      const data = d.data() as GalleryItem;
      const matchesId = d.id === galleryId || data?.id === galleryId;
      const matchesTitle = Boolean(
        title && data?.title && data.title.trim().toLowerCase() === title.trim().toLowerCase()
      );
      if (matchesId || matchesTitle) {
        await deleteDoc(doc(db, COL_GALLERY, d.id));
      }
    }
  } catch (err) {
    console.error("Error scanning gallery to delete:", err);
  }
}


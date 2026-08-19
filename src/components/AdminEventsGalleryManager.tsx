import React, { useState } from "react";
import { AssociationEvent, GalleryItem, KollamTaluk } from "../types";
import {
  Calendar,
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Clock,
  MapPin,
  Tag,
  Upload,
  CheckCircle2,
  X,
  Search,
  Filter,
  Layers,
  Sparkles,
  AlertCircle,
  Eye,
  Loader2,
  Check,
  Save,
} from "lucide-react";
import { ensureSafeImagePayload } from "../lib/imageCompressor";

interface AdminEventsGalleryManagerProps {
  events: AssociationEvent[];
  setEvents: React.Dispatch<React.SetStateAction<AssociationEvent[]>>;
  gallery: GalleryItem[];
  setGallery: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  onSaveEventOnline?: (event: AssociationEvent) => Promise<void>;
  onDeleteEventOnline?: (eventId: string, title?: string) => Promise<void>;
  onSaveGalleryItemOnline?: (item: GalleryItem) => Promise<void>;
  onDeleteGalleryItemOnline?: (galleryId: string, title?: string) => Promise<void>;
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

export const AdminEventsGalleryManager: React.FC<AdminEventsGalleryManagerProps> = ({
  events,
  setEvents,
  gallery,
  setGallery,
  onSaveEventOnline,
  onDeleteEventOnline,
  onSaveGalleryItemOnline,
  onDeleteGalleryItemOnline,
}) => {
  const [subTab, setSubTab] = useState<"events" | "gallery">("events");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Upcoming" | "Completed">("all");
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Modal states for Events
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AssociationEvent | null>(null);
  const [eventFormData, setEventFormData] = useState<Partial<AssociationEvent>>({
    title: "",
    date: new Date().toISOString().split("T")[0],
    time: "10:00 AM - 04:00 PM",
    venue: "District Maratha Bhavan Auditorium, Anandavalleswaram, Kollam",
    talukUnit: "Kollam Town & East",
    description: "",
    status: "Upcoming",
    imageUrl: "",
  });

  // Modal states for Gallery
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [galleryFormData, setGalleryFormData] = useState<Partial<GalleryItem>>({
    title: "",
    date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    caption: "",
    imageUrl: "",
  });

  // Delete confirmation
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const [deletingGalleryId, setDeletingGalleryId] = useState<string | null>(null);

  // Dynamic Save States for Color Transitions
  const [isSavingEvent, setIsSavingEvent] = useState(false);
  const [eventSaveSuccess, setEventSaveSuccess] = useState(false);
  const [isSavingGallery, setIsSavingGallery] = useState(false);
  const [gallerySaveSuccess, setGallerySaveSuccess] = useState(false);

  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  // ----------------------------------------------------
  // EVENT HANDLERS
  // ----------------------------------------------------
  const handleOpenAddEvent = () => {
    setEditingEvent(null);
    setIsSavingEvent(false);
    setEventSaveSuccess(false);
    setEventFormData({
      title: "",
      date: new Date().toISOString().split("T")[0],
      time: "10:00 AM - 04:00 PM",
      venue: "District Maratha Bhavan Auditorium, Anandavalleswaram, Kollam",
      talukUnit: "Kollam Town & East",
      description: "",
      status: "Upcoming",
      imageUrl: "",
    });
    setIsEventModalOpen(true);
  };

  const handleOpenEditEvent = (evt: AssociationEvent) => {
    setEditingEvent(evt);
    setIsSavingEvent(false);
    setEventSaveSuccess(false);
    setEventFormData({ ...evt });
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventFormData.title?.trim()) {
      alert("Please provide an event title.");
      return;
    }

    setIsSavingEvent(true);

    try {
      const safeImage = await ensureSafeImagePayload(
        eventFormData.imageUrl || ""
      );

      const eventToSave: AssociationEvent = {
        id: editingEvent ? editingEvent.id : `evt-${Date.now()}`,
        title: eventFormData.title.trim(),
        date: eventFormData.date || new Date().toISOString().split("T")[0],
        time: eventFormData.time || "10:00 AM - 04:00 PM",
        venue: eventFormData.venue || "HQ Maratha Bhavan Hall, Kollam",
        talukUnit: (eventFormData.talukUnit as KollamTaluk) || "Kollam Town & East",
        description: eventFormData.description || "",
        status: (eventFormData.status as "Upcoming" | "Completed") || "Upcoming",
        imageUrl: safeImage,
      };

      if (editingEvent) {
        setEvents((prev) =>
          prev.map((item) => (item.id === eventToSave.id ? eventToSave : item))
        );
        showToast(`Event "${eventToSave.title}" updated successfully!`);
      } else {
        setEvents((prev) => [eventToSave, ...prev]);
        showToast(`New event "${eventToSave.title}" added to schedule!`);
      }

      if (onSaveEventOnline) {
        await onSaveEventOnline(eventToSave);
      }

      setEventSaveSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsEventModalOpen(false);
    } catch (err) {
      console.error("Error saving event:", err);
      showToast("Error saving event details.");
    } finally {
      setIsSavingEvent(false);
      setEventSaveSuccess(false);
    }
  };

  const handleConfirmDeleteEvent = async (id: string) => {
    const target = events.find((item) => item.id === id);
    setEvents((prev) => prev.filter((item) => item.id !== id));
    if (onDeleteEventOnline) {
      await onDeleteEventOnline(id, target?.title);
    }
    setDeletingEventId(null);
    showToast("Event removed from association schedule.");
  };

  const handleToggleEventStatus = async (evt: AssociationEvent) => {
    const updated: AssociationEvent = {
      ...evt,
      status: evt.status === "Upcoming" ? "Completed" : "Upcoming",
    };
    setEvents((prev) => prev.map((item) => (item.id === evt.id ? updated : item)));
    if (onSaveEventOnline) {
      await onSaveEventOnline(updated);
    }
    showToast(`Status changed to ${updated.status}`);
  };

  const handleEventImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const raw = event.target?.result as string;
        const compressed = await ensureSafeImagePayload(raw);
        setEventFormData((prev) => ({ ...prev, imageUrl: compressed }));
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Image file load failed:", err);
    }
  };

  // ----------------------------------------------------
  // GALLERY HANDLERS
  // ----------------------------------------------------
  const handleOpenAddGallery = () => {
    setEditingGalleryItem(null);
    setIsSavingGallery(false);
    setGallerySaveSuccess(false);
    setGalleryFormData({
      title: "",
      date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      caption: "",
      imageUrl: "",
    });
    setIsGalleryModalOpen(true);
  };

  const handleOpenEditGallery = (item: GalleryItem) => {
    setEditingGalleryItem(item);
    setIsSavingGallery(false);
    setGallerySaveSuccess(false);
    setGalleryFormData({ ...item });
    setIsGalleryModalOpen(true);
  };

  const handleSaveGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryFormData.title?.trim()) {
      alert("Please provide a title for the photo archive item.");
      return;
    }

    setIsSavingGallery(true);

    try {
      const safeImage = await ensureSafeImagePayload(
        galleryFormData.imageUrl || ""
      );

      const itemToSave: GalleryItem = {
        id: editingGalleryItem ? editingGalleryItem.id : `gal-${Date.now()}`,
        title: galleryFormData.title.trim(),
        date: galleryFormData.date || "2026",
        caption: galleryFormData.caption || "",
        imageUrl: safeImage,
      };

      if (editingGalleryItem) {
        setGallery((prev) =>
          prev.map((item) => (item.id === itemToSave.id ? itemToSave : item))
        );
        showToast(`Gallery item "${itemToSave.title}" updated!`);
      } else {
        setGallery((prev) => [itemToSave, ...prev]);
        showToast(`New photo "${itemToSave.title}" added to gallery!`);
      }

      if (onSaveGalleryItemOnline) {
        await onSaveGalleryItemOnline(itemToSave);
      }

      setGallerySaveSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsGalleryModalOpen(false);
    } catch (err) {
      console.error("Error saving gallery item:", err);
      showToast("Error saving gallery picture.");
    } finally {
      setIsSavingGallery(false);
      setGallerySaveSuccess(false);
    }
  };

  const handleConfirmDeleteGallery = async (id: string) => {
    const target = gallery.find((item) => item.id === id);
    setGallery((prev) => prev.filter((item) => item.id !== id));
    if (onDeleteGalleryItemOnline) {
      await onDeleteGalleryItemOnline(id, target?.title);
    }
    setDeletingGalleryId(null);
    showToast("Photo removed from association gallery.");
  };

  const handleGalleryImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const raw = event.target?.result as string;
        const compressed = await ensureSafeImagePayload(raw);
        setGalleryFormData((prev) => ({ ...prev, imageUrl: compressed }));
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Gallery file load failed:", err);
    }
  };

  // Filtered lists
  const filteredEvents = events.filter((evt) => {
    const matchesQuery =
      !searchQuery.trim() ||
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.talukUnit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || evt.status === statusFilter;

    return matchesQuery && matchesStatus;
  });

  const filteredGallery = gallery.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.caption.toLowerCase().includes(q) ||
      item.date.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5 text-xs text-stone-200">
      {/* Toast Notification Alert */}
      {notificationMsg && (
        <div className="flex items-center gap-2 p-3 bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 rounded-xl font-bold shadow-lg animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Header and Sub-tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-950 p-3.5 rounded-2xl border border-stone-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-200">
              Events & Photo Gallery Management
            </h3>
            <p className="text-[11px] text-stone-400">
              Create, edit, schedule association events, and curate public photo archive.
            </p>
          </div>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-xl border border-stone-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setSubTab("events");
              setSearchQuery("");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
              subTab === "events"
                ? "bg-amber-500 text-stone-950 shadow-md font-black"
                : "text-stone-300 hover:text-amber-200 hover:bg-stone-800"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Events ({events.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSubTab("gallery");
              setSearchQuery("");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
              subTab === "gallery"
                ? "bg-amber-500 text-stone-950 shadow-md font-black"
                : "text-stone-300 hover:text-amber-200 hover:bg-stone-800"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Photo Archive ({gallery.length})</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 1: ASSOCIATION EVENTS */}
      {/* ------------------------------------------------------------- */}
      {subTab === "events" && (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search events by title, venue, or taluk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-200 text-[10px]"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800">
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                    statusFilter === "all"
                      ? "bg-stone-800 text-amber-300"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("Upcoming")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                    statusFilter === "Upcoming"
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("Completed")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                    statusFilter === "Completed"
                      ? "bg-stone-800 text-stone-300"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            {/* Add Event Button */}
            <button
              type="button"
              onClick={handleOpenAddEvent}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs shadow-lg transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Event</span>
            </button>
          </div>

          {/* Events Grid List */}
          {filteredEvents.length === 0 ? (
            <div className="bg-stone-950 border border-stone-800 rounded-2xl p-8 text-center space-y-2">
              <Calendar className="w-8 h-8 text-stone-600 mx-auto" />
              <p className="text-sm font-bold text-stone-400">No events found</p>
              <p className="text-xs text-stone-500">
                {searchQuery
                  ? "Try clearing your search term to see all events."
                  : "Click 'Add New Event' to post an association meeting or cultural celebration."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-stone-950 border border-stone-800/90 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all shadow-md flex flex-col justify-between group"
                >
                  <div className="flex flex-col sm:flex-row gap-3 p-3">
                    {/* Thumbnail */}
                    <div className="relative w-full sm:w-32 h-28 shrink-0 rounded-xl overflow-hidden bg-stone-900 border border-stone-800">
                      <img
                        src={evt.imageUrl}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <span
                        className={`absolute top-1.5 left-1.5 text-[9px] font-black uppercase px-2 py-0.5 rounded backdrop-blur-md ${
                          evt.status === "Upcoming"
                            ? "bg-emerald-950/90 text-emerald-300 border border-emerald-500/50"
                            : "bg-stone-900/90 text-stone-300 border border-stone-700"
                        }`}
                      >
                        {evt.status}
                      </span>
                    </div>

                    {/* Content info */}
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-amber-400 font-semibold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20 truncate">
                          {evt.talukUnit} Unit
                        </span>
                      </div>

                      <h4 className="font-bold text-stone-100 text-xs leading-snug line-clamp-2">
                        {evt.title}
                      </h4>

                      <div className="space-y-0.5 text-[11px] text-stone-400">
                        <p className="flex items-center gap-1.5 text-amber-300/90 font-medium truncate">
                          <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{evt.date} • {evt.time}</span>
                        </p>
                        <p className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3 h-3 text-stone-500 shrink-0" />
                          <span className="truncate">{evt.venue}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between px-3 py-2 bg-stone-900/70 border-t border-stone-800/80 text-[11px]">
                    <button
                      type="button"
                      onClick={() => handleToggleEventStatus(evt)}
                      className={`font-semibold px-2 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                        evt.status === "Upcoming"
                          ? "text-emerald-400 hover:bg-emerald-950/50"
                          : "text-stone-400 hover:bg-stone-800"
                      }`}
                      title="Click to toggle status between Upcoming and Completed"
                    >
                      <span>Mark {evt.status === "Upcoming" ? "Completed" : "Upcoming"}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditEvent(evt)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 transition-all"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeletingEventId(evt.id)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-950/40 hover:bg-red-950 text-red-400 font-bold border border-red-500/30 transition-all"
                        title="Delete Event"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SUB-TAB 2: PHOTO ARCHIVE & GALLERY */}
      {/* ------------------------------------------------------------- */}
      {subTab === "gallery" && (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search photo gallery by title or caption..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-200 text-[10px]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Add Photo Button */}
            <button
              type="button"
              onClick={handleOpenAddGallery}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs shadow-lg transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Photo to Gallery</span>
            </button>
          </div>

          {/* Gallery Grid List */}
          {filteredGallery.length === 0 ? (
            <div className="bg-stone-950 border border-stone-800 rounded-2xl p-8 text-center space-y-2">
              <ImageIcon className="w-8 h-8 text-stone-600 mx-auto" />
              <p className="text-sm font-bold text-stone-400">No gallery photos found</p>
              <p className="text-xs text-stone-500">
                Click 'Add Photo to Gallery' to upload event photos and memory archives.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {filteredGallery.map((item) => (
                <div
                  key={item.id}
                  className="bg-stone-950 border border-stone-800 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all shadow-md flex flex-col justify-between group"
                >
                  <div>
                    {/* Picture Preview */}
                    <div className="relative h-40 w-full overflow-hidden bg-stone-900 border-b border-stone-800">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="p-3 space-y-1">
                      <span className="text-[10px] text-amber-400 font-mono font-bold block">
                        {item.date}
                      </span>
                      <h4 className="font-bold text-stone-100 text-xs line-clamp-1">
                        {item.title}
                      </h4>
                      {item.caption && (
                        <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                          {item.caption}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1.5 p-2 bg-stone-900/60 border-t border-stone-800">
                    <button
                      type="button"
                      onClick={() => handleOpenEditGallery(item)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 transition-all text-[11px]"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingGalleryId(item.id)}
                      className="flex items-center gap-1 p-1.5 rounded-lg bg-red-950/40 hover:bg-red-950 text-red-400 font-bold border border-red-500/30 transition-all text-[11px]"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT EVENT */}
      {/* ------------------------------------------------------------- */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-amber-500/40 rounded-2xl max-w-lg w-full p-5 text-stone-100 shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-100 text-sm">
                    {editingEvent ? "Edit Association Event" : "Create New Association Event"}
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    Enter event details, schedule, venue, and banner picture.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEventModalOpen(false)}
                className="text-stone-400 hover:text-stone-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-3.5 text-xs">
              {/* Event Title */}
              <div className="space-y-1">
                <label className="font-semibold text-stone-300 block">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shivaji Maharaj Jayanti Fest & Cultural Rally"
                  value={eventFormData.title || ""}
                  onChange={(e) =>
                    setEventFormData({ ...eventFormData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Date, Time & Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-300 block">Date *</label>
                  <input
                    type="date"
                    required
                    value={eventFormData.date || ""}
                    onChange={(e) =>
                      setEventFormData({ ...eventFormData, date: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-300 block">Time Schedule *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 09:30 AM - 05:00 PM"
                    value={eventFormData.time || ""}
                    onChange={(e) =>
                      setEventFormData({ ...eventFormData, time: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-300 block">Status</label>
                  <select
                    value={eventFormData.status || "Upcoming"}
                    onChange={(e) =>
                      setEventFormData({
                        ...eventFormData,
                        status: e.target.value as "Upcoming" | "Completed",
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500 text-xs"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Organizing Taluk Unit */}
              <div className="space-y-1">
                <label className="font-semibold text-stone-300 block">
                  Organizing Taluk Unit
                </label>
                <select
                  value={eventFormData.talukUnit || "Kollam Town & East"}
                  onChange={(e) =>
                    setEventFormData({
                      ...eventFormData,
                      talukUnit: e.target.value as KollamTaluk,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500 text-xs"
                >
                  {TALUK_OPTIONS.map((taluk) => (
                    <option key={taluk} value={taluk}>
                      {taluk} Unit
                    </option>
                  ))}
                </select>
              </div>

              {/* Venue */}
              <div className="space-y-1">
                <label className="font-semibold text-stone-300 block">
                  Venue / Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. District Maratha Bhavan Auditorium, Anandavalleswaram, Kollam"
                  value={eventFormData.venue || ""}
                  onChange={(e) =>
                    setEventFormData({ ...eventFormData, venue: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="font-semibold text-stone-300 block">
                  Event Description & Agenda
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe program highlights, chief guests, merit distribution details..."
                  value={eventFormData.description || ""}
                  onChange={(e) =>
                    setEventFormData({ ...eventFormData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500 text-xs leading-relaxed"
                />
              </div>

              {/* Banner Image Selection */}
              <div className="space-y-2 pt-1 border-t border-stone-800">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-stone-300 block">
                    Event Banner Image
                  </label>
                  {eventFormData.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setEventFormData({ ...eventFormData, imageUrl: "" })}
                      className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove Image</span>
                    </button>
                  )}
                </div>

                {/* Current Preview if uploaded */}
                {eventFormData.imageUrl ? (
                  <div className="relative h-32 w-full rounded-xl overflow-hidden bg-stone-950 border border-amber-500/50">
                    <img
                      src={eventFormData.imageUrl}
                      alt="Event Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-2 left-2 text-[10px] bg-stone-950/80 px-2 py-0.5 rounded text-amber-300 font-bold border border-amber-500/30">
                      Live Banner Preview
                    </span>
                  </div>
                ) : null}

                {/* Upload from device */}
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <label className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 hover:border-amber-500/60 cursor-pointer transition-colors text-stone-300 font-semibold text-xs">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload Image from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEventImageFile}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Direct Image URL input */}
                <input
                  type="url"
                  placeholder="Or paste direct image URL (https://...)"
                  value={eventFormData.imageUrl || ""}
                  onChange={(e) =>
                    setEventFormData({ ...eventFormData, imageUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-300 text-[11px] focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEvent}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all duration-300 ${
                    isSavingEvent
                      ? "bg-emerald-600 hover:bg-emerald-600 text-white animate-pulse ring-2 ring-emerald-400 shadow-emerald-600/50 cursor-wait"
                      : eventSaveSuccess
                      ? "bg-emerald-500 text-stone-950 font-black ring-2 ring-emerald-300 shadow-emerald-500/40"
                      : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-amber-500/30"
                  }`}
                >
                  {isSavingEvent ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Saving Event Information...</span>
                    </>
                  ) : eventSaveSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-stone-950 stroke-[3]" />
                      <span>Event Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingEvent ? "Save Event Changes" : "Save Event"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: ADD / EDIT GALLERY ITEM */}
      {/* ------------------------------------------------------------- */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-amber-500/40 rounded-2xl max-w-md w-full p-5 text-stone-100 shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-100 text-sm">
                    {editingGalleryItem ? "Edit Photo Archive Item" : "Add New Photo to Gallery"}
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    Upload Shivaji Jayanti rallies, medical camp, or meeting pictures.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsGalleryModalOpen(false)}
                className="text-stone-400 hover:text-stone-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGalleryItem} className="space-y-3.5 text-xs">
              {/* Photo Title */}
              <div className="space-y-1">
                <label className="font-semibold text-stone-300 block">
                  Photo / Album Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shivaji Jayanti Grand Procession at Kollam Beach"
                  value={galleryFormData.title || ""}
                  onChange={(e) =>
                    setGalleryFormData({ ...galleryFormData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Event Month / Date */}
              <div className="space-y-1">
                <label className="font-semibold text-stone-300 block">
                  Event Month / Date *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. February 2026 or 2026-02-19"
                  value={galleryFormData.date || ""}
                  onChange={(e) =>
                    setGalleryFormData({ ...galleryFormData, date: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              {/* Caption */}
              <div className="space-y-1">
                <label className="font-semibold text-stone-300 block">
                  Photo Caption & Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe attendees, occasion, and special highlights..."
                  value={galleryFormData.caption || ""}
                  onChange={(e) =>
                    setGalleryFormData({ ...galleryFormData, caption: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-500 text-xs leading-relaxed"
                />
              </div>

              {/* Picture Upload */}
              <div className="space-y-2 pt-1 border-t border-stone-800">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-stone-300 block">
                    Gallery Photograph *
                  </label>
                  {galleryFormData.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setGalleryFormData({ ...galleryFormData, imageUrl: "" })}
                      className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove Photo</span>
                    </button>
                  )}
                </div>

                {/* Preview if uploaded */}
                {galleryFormData.imageUrl ? (
                  <div className="relative h-32 w-full rounded-xl overflow-hidden bg-stone-950 border border-amber-500/50">
                    <img
                      src={galleryFormData.imageUrl}
                      alt="Gallery Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-2 left-2 text-[10px] bg-stone-950/80 px-2 py-0.5 rounded text-amber-300 font-bold border border-amber-500/30">
                      Live Photo Preview
                    </span>
                  </div>
                ) : null}

                {/* File Upload Button */}
                <label className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 hover:border-amber-500/60 cursor-pointer transition-colors text-stone-300 font-semibold text-xs">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Choose Photo from Computer / Phone</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryImageFile}
                    className="hidden"
                  />
                </label>

                <input
                  type="url"
                  placeholder="Or paste direct image URL (https://...)"
                  value={galleryFormData.imageUrl || ""}
                  onChange={(e) =>
                    setGalleryFormData({ ...galleryFormData, imageUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-300 text-[11px] focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingGallery}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all duration-300 ${
                    isSavingGallery
                      ? "bg-emerald-600 hover:bg-emerald-600 text-white animate-pulse ring-2 ring-emerald-400 shadow-emerald-600/50 cursor-wait"
                      : gallerySaveSuccess
                      ? "bg-emerald-500 text-stone-950 font-black ring-2 ring-emerald-300 shadow-emerald-500/40"
                      : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-amber-500/30"
                  }`}
                >
                  {isSavingGallery ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Saving Photo to Gallery...</span>
                    </>
                  ) : gallerySaveSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-stone-950 stroke-[3]" />
                      <span>Photo Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingGalleryItem ? "Save Photo Changes" : "Save to Gallery"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CONFIRM DELETE EVENT MODAL */}
      {/* ------------------------------------------------------------- */}
      {deletingEventId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-red-500/40 rounded-2xl max-w-sm w-full p-5 text-stone-100 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-950 text-red-400 border border-red-500/40">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-stone-100 text-sm">Delete Event</h4>
                <p className="text-xs text-stone-400">Are you sure you want to remove this event?</p>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              This will remove the event from the public schedule and members portal across all devices.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setDeletingEventId(null)}
                className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDeleteEvent(deletingEventId)}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CONFIRM DELETE GALLERY MODAL */}
      {/* ------------------------------------------------------------- */}
      {deletingGalleryId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-red-500/40 rounded-2xl max-w-sm w-full p-5 text-stone-100 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-950 text-red-400 border border-red-500/40">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-stone-100 text-sm">Delete Photo</h4>
                <p className="text-xs text-stone-400">Are you sure you want to remove this photo?</p>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              This will permanently remove the photograph from the public photo archive.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setDeletingGalleryId(null)}
                className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDeleteGallery(deletingGalleryId)}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

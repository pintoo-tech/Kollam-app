export type KollamTaluk =
  | "Kollam Town & East"
  | "Karunagappally"
  | "Kunnathur"
  | "Pathanapuram"
  | "Punalur"
  | "Kottarakkara"
  | "Chathannoor & Paravur";

export const MARATHA_ROLES = [
  "अध्यक्ष",
  "उपाध्यक्ष",
  "सेक्रेटरी",
  "जॉईंट सेक्रेटरी",
  "खजिनदार",
  "सहखजिनदार",
  "कार्यकारिणी सदस्य",
  "डिजिटल & सोशल मीडिया",
  "सल्लागार",
  "सदस्य",
] as const;

export type MarathaRole = (typeof MARATHA_ROLES)[number];

export interface Member {
  id: string;
  memberId: string; // e.g. KLM-MWA-1001
  name: string;
  roll?: string; // Primary role: e.g. "सदस्य", "अध्यक्ष", "उपाध्यक्ष", "सेक्रेटरी", etc.
  roll2?: string; // Optional Secondary role
  role2?: string; // Alias for roll2
  houseName?: string;
  talukUnit: KollamTaluk;
  place?: string; // Place (KL)
  district?: string; // District (KL)
  dob?: string; // Date of birth YYYY-MM-DD or MM-DD
  dateOfBirth?: string; // Date of birth alias
  address: string; // Address (KL)
  placeMH?: string; // Place (MH)
  districtMH?: string; // District (MH)
  addressMH?: string; // Address (MH)
  phone: string;
  password?: string; // 4-digit numeric passcode, default "1234"
  hasChangedPasscode?: boolean; // true if member changed from default 1234
  email: string;
  bloodGroup?: string;
  occupation?: string;
  maritalStatus?: "Single" | "Married" | "Widowed";
  familyMembersCount?: number;
  joiningYear?: number;
  status: "Active" | "Life Member" | "Patron Member" | "Pending Approval";
  avatarUrl?: string;
  qrCodeSeed?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  imageUrl?: string;
  date: string;
  category?: string;
  active: boolean;
}

export interface AdvertisementSlide {
  id: string;
  imageUrl: string;
  linkUrl?: string;
  title: string;
  subtitle?: string;
}

export interface GoldRatePromo {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  linkUrl?: string;
}

export interface TalukUnit {
  id: string;
  name: KollamTaluk;
  code: string;
  areaDescription: string;
  convenorName: string;
  convenorPhone: string;
  jointConvenor: string;
  memberCount: number;
  meetingVenue: string;
  meetingSchedule: string;
  activeProjects: string[];
}

export interface WelfareScheme {
  id: string;
  title: string;
  code: string;
  description: string;
  category: "Education" | "Medical" | "Marriage Assistance" | "Senior Care" | "Self Employment";
  maxGrantAmount: string;
  eligibilityCriteria: string[];
  documentsRequired: string[];
  beneficiariesCountInKollam: number;
  badge: string;
}

export interface ExecutiveMember {
  id: string;
  name: string;
  designation: string;
  talukUnit: KollamTaluk;
  role?: string;
  taluk?: string;
  phone: string;
  email: string;
  photoUrl: string;
  portfolio: string;
  priority: number;
}

export interface DownloadResource {
  id: string;
  title: string;
  category: "Membership Form" | "Welfare Application" | "Matrimonial Registration" | "Constitution & Bye-laws" | "Reports & Minutes";
  description: string;
  fileFormat: "PDF" | "DOCX";
  fileSize: string;
  formNumber: string;
  downloadUrl: string;
}

export interface MatrimonialProfile {
  id: string;
  profileCode: string;
  name: string;
  age: number;
  gender: "Groom" | "Bride";
  qualification: string;
  occupation: string;
  companyLocation: string;
  nativeTalukInKollam: KollamTaluk;
  height: string;
  horoscopeRasi?: string;
  contactPerson: string;
  contactPhone: string;
  photoUrl?: string;
}

export interface BloodDonor {
  id: string;
  name: string;
  bloodGroup: string;
  talukUnit: KollamTaluk;
  area: string;
  phone: string;
  lastDonated: string;
  availableForEmergency: boolean;
}

export interface AssociationEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  talukUnit: KollamTaluk;
  description: string;
  category?: string;
  status: "Upcoming" | "Completed";
  imageUrl: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  date: string;
  category?: string;
  imageUrl: string;
  caption: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export interface GoldRates {
  rate22_1g: string; // e.g. "6,740"
  rate22_8g: string; // e.g. "53,920"
  rate999_1g: string; // e.g. "7,350"
  silver999_1g: string; // e.g. "98"
  lastUpdated?: string;
  updatedBy?: string;
}

export type AuthRole = "guest" | "member" | "admin";

export interface CurrentUser {
  role: AuthRole;
  member?: Member | null;
  adminName?: string;
}

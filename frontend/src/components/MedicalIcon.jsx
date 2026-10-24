import {
  Activity,
  Baby,
  Clock,
  HeartHandshake,
  HeartPulse,
  Home,
  Phone,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Users,
  Award,
  ClipboardPlus,
  Plus,
  Syringe,
  Bandage,
  Droplets,
} from "lucide-react";

const ICONS = {
  "heart-pulse": HeartPulse,
  baby: Baby,
  "home-health": Home,
  physio: Activity,
  nurse: Stethoscope,
  "attendant-m": UserRound,
  "attendant-f": Users,
  elder: HeartHandshake,
  "shield-check": ShieldCheck,
  phone: Phone,
  clock: Clock,
  award: Award,
  cross: Plus,
  clipboard: ClipboardPlus,
  stethoscope: Stethoscope,
  syringe: Syringe,
  bandage: Bandage,
  iv: Droplets,
};

export default function MedicalIcon({ name, size = 28, className }) {
  const Icon = ICONS[name] || Stethoscope;
  return <Icon size={size} strokeWidth={1.75} className={className} aria-hidden />;
}

export { ICONS as MEDICAL_ICON_NAMES };

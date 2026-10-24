import {
  Calendar,
  Code,
  FileText,
  HeartPulse,
  Home,
  Image,
  Info,
  LayoutGrid,
  Mail,
  Megaphone,
  Menu,
  PanelBottom,
  PanelTop,
  Palette,
  Phone,
  Search,
  Settings,
  Tags,
  Globe,
  Briefcase,
} from "lucide-react";

const MAP = {
  home: Home,
  info: Info,
  layout: LayoutGrid,
  mail: Mail,
  "heart-pulse": HeartPulse,
  calendar: Calendar,
  megaphone: Megaphone,
  palette: Palette,
  image: Image,
  menu: Menu,
  "panel-top": PanelTop,
  "panel-bottom": PanelBottom,
  search: Search,
  tags: Tags,
  "file-text": FileText,
  phone: Phone,
  settings: Settings,
  code: Code,
  globe: Globe,
  briefcase: Briefcase,
};

export default function AdminNavIcon({ name, size = 18 }) {
  const Icon = MAP[name] || Settings;
  return <Icon size={size} aria-hidden className="admin-nav-icon" />;
}

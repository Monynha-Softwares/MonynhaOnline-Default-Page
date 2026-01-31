import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  Code,
  Dot,
  ExternalLink,
  GitBranch,
  Github,
  Globe,
  GripVertical,
  Heart,
  Lock,
  Monitor,
  MoreHorizontal,
  PanelLeft,
  Search,
  Server,
  Shield,
  Sparkles,
  Twitter,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";

const iconRegistry = Object.freeze({
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  Code,
  Dot,
  ExternalLink,
  GitBranch,
  Github,
  Globe,
  GripVertical,
  Heart,
  Lock,
  Monitor,
  MoreHorizontal,
  PanelLeft,
  Search,
  Server,
  Shield,
  Sparkles,
  Twitter,
  User,
  Users,
  X,
  Zap,
});

export type IconName = keyof typeof iconRegistry;

const iconCache = new Map<IconName, LucideIcon>();
const iconNames = Object.freeze(Object.keys(iconRegistry) as IconName[]);

export const getIcon = (name: IconName): LucideIcon => {
  const cached = iconCache.get(name);
  if (cached) return cached;
  const icon = Object.freeze(iconRegistry[name]);
  iconCache.set(name, icon);
  return icon;
};

export const getIconNames = () => iconNames;

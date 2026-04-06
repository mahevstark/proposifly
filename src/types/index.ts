/** Portfolio link categories */
export type PortfolioCategory = "web" | "mobile" | "figma";

export const PORTFOLIO_CATEGORIES: { value: PortfolioCategory; label: string; icon: string }[] = [
  { value: "web", label: "Web Apps", icon: "🌐" },
  { value: "mobile", label: "Mobile Apps", icon: "📱" },
  { value: "figma", label: "Figma Links", icon: "🎨" },
];

/** Portfolio link item */
export interface PortfolioLink {
  id: string | number;
  title: string;
  url: string;
  is_active?: boolean;
  category?: PortfolioCategory;
}

/** Tone options for proposal generation */
export type Tone = "formal" | "casual" | "persuasive";

/** User profile link (GitHub, LinkedIn, etc.) */
export interface ProfileLink {
  id: string | number;
  platform: string;
  url: string;
  is_active?: boolean;
}

/** Available platform options */
export const PLATFORMS = [
  { value: "github", label: "GitHub", icon: "🐙" },
  { value: "linkedin", label: "LinkedIn", icon: "💼" },
  { value: "behance", label: "Behance", icon: "🎨" },
  { value: "dribbble", label: "Dribbble", icon: "🏀" },
  { value: "twitter", label: "Twitter / X", icon: "🐦" },
  { value: "website", label: "Personal Website", icon: "🌐" },
  { value: "stackoverflow", label: "Stack Overflow", icon: "📚" },
  { value: "medium", label: "Medium", icon: "✍️" },
  { value: "youtube", label: "YouTube", icon: "🎬" },
  { value: "other", label: "Other", icon: "🔗" },
] as const;

/** Request body for /api/generateProposal */
export interface GenerateProposalRequest {
  jobDescription: string;
  tone: Tone;
  portfolioLinks: PortfolioLink[];
}

/** Response from /api/generateProposal */
export interface GenerateProposalResponse {
  proposal: string;
  error?: string;
}

/** Request body for /api/savePortfolio */
export interface SavePortfolioRequest {
  links: PortfolioLink[];
}

/** Saved proposal from DB */
export interface Proposal {
  id: number;
  user_id: number;
  job_title: string | null;
  job_description: string;
  proposal_text: string;
  tone: Tone;
  created_at: string;
}

/** PRD phase item */
export interface PRDPhase {
  number: number;
  title: string;
  enabled: boolean;
}

/** Saved PRD from DB */
export interface PRD {
  id: number;
  proposal_id: number;
  user_id: number;
  budget: string | null;
  timeline: string | null;
  client_name: string | null;
  phases: PRDPhase[];
  tools_technologies: string | null;
  prd_text: string | null;
  created_at: string;
}

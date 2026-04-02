/** Portfolio link item */
export interface PortfolioLink {
  id: string | number;
  title: string;
  url: string;
  is_active?: boolean;
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

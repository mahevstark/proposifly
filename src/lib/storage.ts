import { PortfolioLink, Tone } from "@/types";

const PORTFOLIO_KEY = "proposifly_portfolio";
const TONE_KEY = "proposifly_tone";

/** Load portfolio links from localStorage */
export function loadPortfolio(): PortfolioLink[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(PORTFOLIO_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/** Save portfolio links to localStorage */
export function savePortfolio(links: PortfolioLink[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(links));
}

/** Load default tone preference */
export function loadTone(): Tone {
  if (typeof window === "undefined") return "formal";
  return (localStorage.getItem(TONE_KEY) as Tone) || "formal";
}

/** Save default tone preference */
export function saveTone(tone: Tone): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TONE_KEY, tone);
}

/** Generate a simple unique ID */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

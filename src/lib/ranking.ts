/**
 * Hacker News Gravity Ranking Formula:
 * Score = (Points - 1) / (AgeInHours + 2)^1.8
 *
 * Age is measured from now in hours.
 * Points default to 1, so (Points - 1) defaults to 0 if initial vote is not counted,
 * or with points=1, score is 0. If points > 1, score increases.
 * To ensure items with 1 point still rank chronologically rather than all zero,
 * we can use Math.max(points - 1, 0.5) or standard (points - 1) / (age + 2)^1.8.
 * In the HN algorithm: score = (P - 1) / ((T + 2) ^ G) where G = 1.8.
 */
export function calculateHnScore(points: number, createdAt: Date | string | number): number {
  const itemDate = new Date(createdAt).getTime();
  const now = Date.now();
  const ageInHours = Math.max(0, (now - itemDate) / (1000 * 60 * 60));
  const gravity = 1.8;

  // We add a tiny baseline so items with 1 point don't all produce 0 score
  const adjustedPoints = Math.max(0.1, points - 0.8);
  return adjustedPoints / Math.pow(ageInHours + 2, gravity);
}

export function extractDomain(rawUrl: string | null | undefined): string | null {
  if (!rawUrl) return null;
  try {
    let url = rawUrl.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }
    const parsed = new URL(url);
    let hostname = parsed.hostname;
    if (hostname.startsWith("www.")) {
      hostname = hostname.slice(4);
    }
    return hostname;
  } catch {
    return null;
  }
}

export function formatTimeAgo(dateInput: Date | string | number): string {
  const date = new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears === 1 ? "" : "s"} ago`;
}

export function detectPostType(title: string, url?: string | null, requestedType?: string): "LINK" | "ASK" | "SHOW" | "JOB" {
  if (requestedType && ["LINK", "ASK", "SHOW", "JOB"].includes(requestedType)) {
    return requestedType as "LINK" | "ASK" | "SHOW" | "JOB";
  }

  const lowerTitle = title.toLowerCase().trim();
  if (lowerTitle.startsWith("ask hn:") || lowerTitle.startsWith("ask bn:") || lowerTitle.startsWith("ask:")) {
    return "ASK";
  }
  if (lowerTitle.startsWith("show hn:") || lowerTitle.startsWith("show bn:") || lowerTitle.startsWith("show:")) {
    return "SHOW";
  }
  if (lowerTitle.startsWith("job:") || lowerTitle.includes("is hiring") || lowerTitle.includes("is looking for")) {
    return "JOB";
  }

  if (!url || url.trim().length === 0) {
    return "ASK";
  }

  return "LINK";
}

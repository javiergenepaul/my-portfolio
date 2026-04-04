export interface YearConfig {
  year: number;
  enabled: boolean;
  label: string;
  /** Relative path under /app/(years)/ */
  path: string;
  /** Brief description shown in previews / coming-soon pages */
  description: string;
}

export const YEARS: YearConfig[] = [
  {
    year: 2024,
    enabled: true,
    label: "2024",
    path: "/2024",
    description: "Full-stack engineer — React, Spring Boot, modern web.",
  },
  {
    year: 2025,
    enabled: true,
    label: "2025",
    path: "/2025",
    description: "Coming soon.",
  },
  {
    year: 2026,
    enabled: true,
    label: "2026",
    path: "/2026",
    description: "Coming soon.",
  },
];

/** The latest enabled year, used as the default redirect target. */
export const CURRENT_YEAR: number = [...YEARS]
  .filter((y) => y.enabled)
  .sort((a, b) => b.year - a.year)[0]?.year ?? 2024;

export const getPrevYear = (year: number): YearConfig | undefined => {
  const enabled = YEARS.filter((y) => y.enabled).sort(
    (a, b) => a.year - b.year
  );
  const idx = enabled.findIndex((y) => y.year === year);
  return idx > 0 ? enabled[idx - 1] : undefined;
};

export const getNextYear = (yearNum: number): YearConfig | undefined => {
  const enabled = YEARS.filter((y) => y.enabled).sort(
    (a, b) => a.year - b.year
  );
  const idx = enabled.findIndex((y) => y.year === yearNum);
  return idx < enabled.length - 1 ? enabled[idx + 1] : undefined;
};

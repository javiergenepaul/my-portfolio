import type { LanguageInterface } from "@/config/types";

export const LANGUAGES: LanguageInterface[] = [
  {
    name: "Cebuano",
    nativeName: "Bisaya",
    flagIcon: "circle-flags:ph",
    locale: "ceb",
    level: "Native",
    note: "Mother tongue — spoken from birth",
  },
  {
    name: "Tagalog",
    nativeName: "Wikang Tagalog",
    flagIcon: "circle-flags:ph",
    locale: "fil",
    level: "Native",
    note: "National language — everyday communication",
  },
  {
    name: "English",
    nativeName: "English",
    flagIcon: "circle-flags:us",
    locale: "en",
    level: "Fluent",
    note: "Professional — work, writing & documentation",
  },
  {
    name: "Japanese",
    nativeName: "日本語",
    flagIcon: "circle-flags:jp",
    locale: "ja",
    level: "Basic",
    note: "Currently learning — JLPT N5 level",
  },
];

import { Font } from "@react-pdf/renderer";

let registered = false;

// CJK punctuation + kana + ideographs + fullwidth forms
const CJK_PATTERN = /[　-ヿ㐀-鿿豈-﫿＀-￯]/;

/**
 * Latin locales (en / fil / ceb) use react-pdf's built-in Helvetica — one of
 * the 14 standard PDF fonts, recognized natively by every ATS parser, zero
 * download cost. Japanese needs an embedded CJK font: Noto Sans JP is
 * registered here but only fetched when a document actually uses it.
 */
export function registerResumeFonts() {
  if (registered) return;
  registered = true;

  Font.register({
    family: "NotoSansJP",
    fonts: [
      { src: "/fonts/noto-sans-jp/NotoSansJP-Regular.ttf", fontWeight: 400 },
      { src: "/fonts/noto-sans-jp/NotoSansJP-Bold.ttf", fontWeight: 700 },
    ],
  });

  // Latin words stay whole (no mid-word hyphenation). CJK text has no spaces,
  // so words must be split per character — the interleaved empty strings are
  // the documented react-pdf trick to allow breaks without inserting hyphens.
  Font.registerHyphenationCallback((word) => {
    if (CJK_PATTERN.test(word)) {
      return Array.from(word).flatMap((char) => [char, ""]);
    }
    return [word];
  });
}

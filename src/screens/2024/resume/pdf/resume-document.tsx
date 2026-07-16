import { Document } from "@react-pdf/renderer";
import { FULL_NAME } from "@/config";
import type { ResumeColorConfig, ResumeMode } from "../resume";
import type { ResumeData } from "../resume-content";
import { registerResumeFonts } from "./fonts";
import { SimpleTemplatePdf } from "./simple-template-pdf";
import { ModernTemplatePdf } from "./modern-template-pdf";
import { AtsTemplatePdf } from "./ats-template-pdf";

registerResumeFonts();

interface ResumeDocumentProps {
  mode: ResumeMode;
  colors: ResumeColorConfig;
  isDark: boolean;
  /** Résumé content from the DB; templates fall back to the default when absent. */
  content?: ResumeData;
}

/**
 * react-pdf mirror of the on-screen templates. Rendered via
 * `pdf(<ResumeDocument … />).toBlob()` so the export is a real,
 * text-selectable PDF instead of a browser print capture.
 */
export function ResumeDocument({
  mode,
  colors,
  isDark,
  content,
}: ResumeDocumentProps) {
  return (
    <Document title={`${FULL_NAME} — Resume`} author={FULL_NAME}>
      {mode === "simple" ? (
        // Simple renders from the portfolio config (getResumeData/SKILL_CATEGORIES),
        // not the résumé content model, so it takes no `content`. It isn't
        // selectable in the résumé UI today — only ATS and Modern are.
        <SimpleTemplatePdf colors={colors} isDark={isDark} />
      ) : mode === "modern" ? (
        <ModernTemplatePdf colors={colors} isDark={isDark} content={content} />
      ) : (
        <AtsTemplatePdf colors={colors} isDark={isDark} content={content} />
      )}
    </Document>
  );
}

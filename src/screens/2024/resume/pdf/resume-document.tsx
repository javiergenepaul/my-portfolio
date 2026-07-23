import { Document } from "@react-pdf/renderer";
import type { ResumeColorConfig, ResumeMode } from "../resume";
import type { ResumeData } from "../resume-content";
import { registerResumeFonts } from "./fonts";
import { ModernTemplatePdf } from "./modern-template-pdf";
import { AtsTemplatePdf } from "./ats-template-pdf";

registerResumeFonts();

interface ResumeDocumentProps {
  mode: ResumeMode;
  colors: ResumeColorConfig;
  isDark: boolean;
  /** Résumé content from the DB; templates fall back to the default when absent. */
  content?: ResumeData;
  /** Owner name for the PDF metadata. Passed in because react-pdf renders this
   *  tree outside React, so hooks can't read the content store here. */
  ownerName: string;
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
  ownerName,
}: ResumeDocumentProps) {
  return (
    <Document title={`${ownerName} — Resume`} author={ownerName}>
      {mode === "modern" ? (
        <ModernTemplatePdf colors={colors} isDark={isDark} content={content} />
      ) : (
        <AtsTemplatePdf colors={colors} isDark={isDark} content={content} />
      )}
    </Document>
  );
}

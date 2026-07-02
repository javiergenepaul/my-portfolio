import { Document } from "@react-pdf/renderer";
import { FULL_NAME } from "@/config";
import type { ResumeColorConfig, ResumeMode } from "../resume";
import { registerResumeFonts } from "./fonts";
import { SimpleTemplatePdf } from "./simple-template-pdf";
import { ModernTemplatePdf } from "./modern-template-pdf";
import { AtsTemplatePdf } from "./ats-template-pdf";

registerResumeFonts();

interface ResumeDocumentProps {
  mode: ResumeMode;
  colors: ResumeColorConfig;
  isDark: boolean;
}

/**
 * react-pdf mirror of the on-screen templates. Rendered via
 * `pdf(<ResumeDocument … />).toBlob()` so the export is a real,
 * text-selectable PDF instead of a browser print capture.
 */
export function ResumeDocument({ mode, colors, isDark }: ResumeDocumentProps) {
  return (
    <Document title={`${FULL_NAME} — Resume`} author={FULL_NAME}>
      {mode === "simple" ? (
        <SimpleTemplatePdf colors={colors} isDark={isDark} />
      ) : mode === "modern" ? (
        <ModernTemplatePdf colors={colors} isDark={isDark} />
      ) : (
        <AtsTemplatePdf colors={colors} isDark={isDark} />
      )}
    </Document>
  );
}

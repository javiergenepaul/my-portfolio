import * as url from "@/config";
import { translate } from "@/i18n";
import { HighlightText } from "../components";

export const FooterSection = () => {
  return (
    <footer className="self-center max-w-lg py-10 text-center select-none">
      <p className="p-2 text-sm transition-all duration-300 bg-background">
        {translate("footer.content_one")}
        {
          <HighlightText
            text={translate("footer.creditsOwner")}
            url={url.CREDITS_OWNER_URL}
          />
        }
        {translate("footer.content_two")}
        {<HighlightText text={translate("footer.figma")} url={url.FIGMA_URL} />}
        {translate("footer.content_three")}
        {
          <HighlightText
            text={translate("footer.visualStudioCode")}
            url={url.VSCODE_URL}
          />
        }
        {translate("footer.content_four")}
        {<HighlightText text={translate("footer.vite")} url={url.VITE_URL} />}
        {<HighlightText text={translate("footer.react")} url={url.REACT_URL} />}
        {
          <HighlightText
            text={translate("footer.tailwind")}
            url={url.TAILWIND_URL}
          />
        }
        {translate("footer.content_five")}
      </p>
    </footer>
  );
};

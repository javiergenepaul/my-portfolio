import { I18nextProvider, useTranslation } from "react-i18next";
import { AppRoutes } from "../routes";
import {
  BackgroundParticle,
  FloatingNavigation,
  GlobalHelmet,
  Toaster,
} from "./components";
import { MainContainerProvider } from "./providers";
import "typeface-inter";
import "typeface-work-sans";
import "typeface-poppins";

function App() {
  const { i18n } = useTranslation();
  return (
    <div dir={i18n.dir()}>
      <I18nextProvider i18n={i18n}>
        <GlobalHelmet />
        <Toaster />
        <FloatingNavigation />
        <BackgroundParticle />

        <MainContainerProvider>
          <AppRoutes />
        </MainContainerProvider>
      </I18nextProvider>
    </div>
  );
}

export default App;

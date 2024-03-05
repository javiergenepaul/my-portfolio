import { I18nextProvider } from "react-i18next";
import { AppRoutes } from "../routes";
import { BackgroundParticle, GlobalHelmet, Toaster } from "./components";
import { MainContainerProvider } from "./providers";
import { i18n } from "./i18n";
import "typeface-inter";
import "typeface-work-sans";
import "typeface-poppins";

function App() {
  return (
    <>
      <I18nextProvider i18n={i18n}>
        <GlobalHelmet />
        <Toaster />
        <BackgroundParticle />
        <MainContainerProvider>
          <AppRoutes />
        </MainContainerProvider>
      </I18nextProvider>
    </>
  );
}

export default App;

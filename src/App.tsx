import { I18nextProvider } from "react-i18next";
import { AppRoutes } from "../routes";
import { GlobalHelmet, Toaster } from "./components";
import { MainContainerProvider } from "./providers";
import { i18n } from "./i18n";

function App() {
  return (
    <>
      <I18nextProvider i18n={i18n}>
        <GlobalHelmet />
        <Toaster />
        <MainContainerProvider>
          <AppRoutes />
        </MainContainerProvider>
      </I18nextProvider>
    </>
  );
}

export default App;

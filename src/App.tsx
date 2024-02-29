import { AppRoutes } from "../routes";
import { GlobalHelmet, Toaster } from "./components";
import { MainContainerProvider } from "./providers";


function App() {
  return (
    <>
      <GlobalHelmet />
      <Toaster />
      <MainContainerProvider>
        <AppRoutes />
      </MainContainerProvider>
    </>
  );
}

export default App;

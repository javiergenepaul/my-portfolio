import { AppRoutes } from "../routes";
import { GlobalHelmet } from "./components";
import { MainContainerProvider } from "./providers";


function App() {
  return (
    <>
      <GlobalHelmet />
      <MainContainerProvider>
        <AppRoutes />
      </MainContainerProvider>
    </>
  );
}

export default App;

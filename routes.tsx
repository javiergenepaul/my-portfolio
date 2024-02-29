import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PATH } from "./src/config";
import * as Screens from "./src/screens";
import { HeaderTitleProvider } from "@/providers";

const AppScreen = (props: { component: React.ReactNode }) => {
  return <HeaderTitleProvider>{props.component}</HeaderTitleProvider>;
};

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="*"
          element={<AppScreen component={<Screens.NotFound />} />}
        />
        <Route
          path={PATH.HOME.path}
          element={<AppScreen component={<Screens.Hero />} />}
        />
        <Route
          path={PATH.ABOUT.path}
          element={<AppScreen component={<Screens.About />} />}
        />
        <Route
          path={PATH.PROJECTS.path}
          element={<AppScreen component={<Screens.Project />} />}
        />
        <Route
          path={PATH.SKILLS.path}
          element={<AppScreen component={<Screens.Skills />} />}
        />
        <Route
          path={PATH.CONTACTS.path}
          element={<AppScreen component={<Screens.Contact />} />}
        />
        <Route
          path={PATH.CONFIDENTIAL.path}
          element={<AppScreen component={<Screens.Confidential />} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

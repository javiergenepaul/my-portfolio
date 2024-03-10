import {
  RouterProvider,
  createBrowserRouter,
  useLocation,
} from "react-router-dom";
import { PATH } from "./src/config";
import * as Screens from "./src/screens";
import { HeaderTitleProvider } from "@/providers";
import SideBarLayout from "@/layout/sidebar-layout";
import { useEffect } from "react";
import { useSettingsStore } from "@/stores";

const AppScreen = (props: { component: React.ReactNode }) => {
  const { setHideFloatingSettings } = useSettingsStore();
  const { component } = props;

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === PATH.SETTINGS.path) {
      setHideFloatingSettings(true);
    } else {
      setHideFloatingSettings(false);
    }
  }, [location.pathname]);

  return (
    <HeaderTitleProvider>
      <SideBarLayout>{component}</SideBarLayout>
    </HeaderTitleProvider>
  );
};

const router = createBrowserRouter([
  {
    path: PATH.HOME.path,
    element: <AppScreen component={<Screens.Hero />} />,
  },
  {
    path: PATH.ABOUT.path,
    element: <AppScreen component={<Screens.About />} />,
  },
  {
    path: PATH.PROJECTS.path,
    element: <AppScreen component={<Screens.Project />} />,
  },
  {
    path: PATH.SKILLS.path,
    element: <AppScreen component={<Screens.Skills />} />,
  },
  {
    path: PATH.CONTACTS.path,
    element: <AppScreen component={<Screens.Contact />} />,
  },
  {
    path: PATH.CONFIDENTIAL.path,
    element: <AppScreen component={<Screens.Confidential />} />,
  },
  {
    path: PATH.SETTINGS.path,
    element: <AppScreen component={<Screens.Settings />} />,
    children: [
      {
        path: "",
        element: <Screens.SettingsGeneral />,
      },
      {
        path: "appearance",
        element: <Screens.SettingsAppearance />,
      },
    ],
  },
  {
    path: "*",
    element: <AppScreen component={<Screens.NotFound />} />,
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

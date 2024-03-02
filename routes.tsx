import {
  BrowserRouter,
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import { PATH } from "./src/config";
import * as Screens from "./src/screens";
import { HeaderTitleProvider } from "@/providers";
import SideBarLayout from "@/layout/sidebar-layout";

const AppScreen = (props: { component: React.ReactNode }) => {
  const { component } = props;

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
    //  loader: loaders.rootLoader,
  },
  {
    path: PATH.ABOUT.path,
    element: <AppScreen component={<Screens.About />} />,
    //  loader: loaders.rootLoader,
  },
  {
    path: PATH.PROJECTS.path,
    element: <AppScreen component={<Screens.Project />} />,
    //  loader: loaders.rootLoader,
  },
  {
    path: PATH.SKILLS.path,
    element: <AppScreen component={<Screens.Skills />} />,
    //  loader: loaders.rootLoader,
  },
  {
    path: PATH.CONTACTS.path,
    element: <AppScreen component={<Screens.Contact />} />,
    //  loader: loaders.rootLoader,
  },
  {
    path: PATH.CONFIDENTIAL.path,
    element: <AppScreen component={<Screens.Confidential />} />,
    //  loader: loaders.rootLoader,
  },
  {
    path: PATH.SETTINGS.path,
    element: <AppScreen component={<Screens.Settings />} />,
    children: [
      {
        path: "",
        element: <Screens.SettingsGeneral />,
        //  loader: loaders.rootLoader,
      },
      {
        path: "appearance",
        element: <Screens.SettingsAppearance />,
        //  loader: loaders.rootLoader,
      },
    ],
  },
  {
    path: "*",
    element: <AppScreen component={<Screens.NotFound />} />,
    //  loader: loaders.rootLoader,
  },
]);

export const AppRoutes = () => {
  return (
    <RouterProvider router={router} />
    // <BrowserRouter>
    //   <Routes>
    //     <Route
    //       path="*"
    //       element={<AppScreen component={<Screens.NotFound />} />}
    //     />
    //     <Route
    //       path={PATH.HOME.path}
    //       element={<AppScreen component={<Screens.Hero />} />}
    //     />
    //     <Route
    //       path={PATH.ABOUT.path}
    //       element={<AppScreen component={<Screens.About />} />}
    //     />
    //     <Route
    //       path={PATH.PROJECTS.path}
    //       element={<AppScreen component={<Screens.Project />} />}
    //     />
    //     <Route
    //       path={PATH.SKILLS.path}
    //       element={<AppScreen component={<Screens.Skills />} />}
    //     />
    //     <Route
    //       path={PATH.CONTACTS.path}
    //       element={<AppScreen component={<Screens.Contact />} />}
    //     />
    //     <Route
    //       path={PATH.CONFIDENTIAL.path}
    //       element={<AppScreen component={<Screens.Confidential />} />}
    //     />
    //     <Route
    //       path={PATH.SETTINGS.path}
    //       element={<AppScreen component={<Screens.Settings />} />}
    //     >
    //       <Route path="" element={<Screens.SettingsHome />} />
    //       <Route path="appearance" element={<Screens.SettingsAppearance />} />
    //     </Route>
    //   </Routes>
    // </BrowserRouter>
  );
};

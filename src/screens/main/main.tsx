import { FloatingNavbar } from "@/components";
import { Outlet } from "react-router-dom";

export const Main = () => {
  return (
    <>
      <FloatingNavbar />
      <Outlet />
    </>
  );
};

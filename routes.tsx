import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PATH } from "./src/config";
import * as Screens from "./src/screens";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Screens.NotFound />} />
        <Route path={PATH.HOME.path} element={<Screens.Hero />} />
      </Routes>
    </BrowserRouter>
  );
};

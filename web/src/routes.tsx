import React from "react";
import { Route, BrowserRouter } from "react-router-dom";

import Home from "./pages/Home";
import CreateProfile from "./pages/CreateProfile";

const Routes = () => {
  return (
    <BrowserRouter>
      <Route component={Home} path="/" exact />
      <Route component={CreateProfile} path="/create-profile" />
    </BrowserRouter>
  );
};

export default Routes;

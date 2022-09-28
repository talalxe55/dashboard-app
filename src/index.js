import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";
import RTLLayout from "layouts/RTL.js";

import { ProtectedRoute } from "./layouts/ProtectedRoute";
import { AuthProvider } from "auth-context/auth.context";
import "./assets/styles/styles.scss";
let user = localStorage.getItem("user");
user = JSON.parse(user);

ReactDOM.render(
  <AuthProvider userData={user}>
    <HashRouter>
      <Switch>
        <Route path={`/auth`} component={AuthLayout} />
        <ProtectedRoute path={`/admin`} component={AdminLayout} />
        <ProtectedRoute path={`/rtl`} component={RTLLayout} />
        <Redirect from={`/`} to="/admin/test" />
      </Switch>
    </HashRouter>
  </AuthProvider>,
  document.getElementById("root")
);

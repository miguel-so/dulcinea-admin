import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import { Path } from "../lib/constants/path.constants";
import Login from "../pages/auth/Login";
import Users from "../pages/admin/Users";
import Categories from "../pages/admin/Categories";
import Artworks from "../pages/admin/Artworks";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";
import SiteContents from "../pages/admin/SiteContents";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path={Path.LOGIN} element={<Login />} />
        <Route path={Path.REGISTER} element={<Register />} />
        <Route path={Path.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route
          path={`${Path.RESET_PASSWORD}/:email`}
          element={<ResetPassword />}
        />
        <Route path={Path.VERIFY_EMAIL} element={<VerifyEmail />} />

        <Route element={<PrivateRoute />}>
          <Route path={Path.USERS} element={<Users />} />
          <Route path={Path.CATEGORIES} element={<Categories />} />
          <Route path={Path.ARTWORKS} element={<Artworks />} />
          <Route path={Path.SITE_CONTENTS} element={<SiteContents />} />
        </Route>

        <Route path="*" element={<Navigate to={Path.LOGIN} />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

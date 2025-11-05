import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import UnauthorizedRoute from "./UnauthorizedRoute";
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
import Home from "../pages/Home";
import About from "../pages/About";
import Arts from "../pages/Arts";
import ArtworkDetails from "../pages/ArtworkDetails";
import ContactForm from "../pages/Contact";

const AppRoutes = () => {
  return (
    <Router basename="/admin">
      <Routes>
        <Route path={Path.LOGIN} element={<Login />} />
        <Route path={Path.REGISTER} element={<Register />} />
        <Route path={Path.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route
          path={`${Path.RESET_PASSWORD}/:email`}
          element={<ResetPassword />}
        />
        <Route path={Path.VERIFY_EMAIL} element={<VerifyEmail />} />

        {/* <Route element={<UnauthorizedRoute />}>
          <Route path={Path.HOME} element={<Home />} />
          <Route path={Path.ABOUT} element={<About />} />
          <Route path={Path.ARTS} element={<Arts />} />
          <Route path={`${Path.ARTWORK_DETAILS}/:artworkId`} element={<ArtworkDetails />} />
          <Route path={`${Path.CONTACT}/:artworkId`} element={<ContactForm />} />
        </Route> */}

        <Route element={<PrivateRoute />}>
          <Route path={Path.USERS} element={<Users />} />
          <Route path={Path.CATEGORIES} element={<Categories />} />
          <Route path={Path.ARTWORKS} element={<Artworks />} />
        </Route>

        <Route path="*" element={<Navigate to={Path.LOGIN} />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

// import
import Dashboard from "views/Dashboard/Dashboard.js";
import Tables from "views/Dashboard/Tables.js";
import Billing from "views/Dashboard/Billing.js";
import RTLPage from "views/RTL/RTLPage.js";
import Profile from "views/Dashboard/Profile.js";
import SignIn from "views/Pages/SignIn.js";
import SignUp from "views/Pages/SignUp.js";
import SignOut from "views/Pages/SignOut.js";
import ForgotPassword from "views/Pages/ForgotPassword";
import SingleCustomer from "views/Pages/SingleCustomer";
import Payments from "views/Dashboard/Payments.js";
import Detail from "views/Dashboard/SinglePayment.js";
import Users from "views/Dashboard/Users.js";
import ResetPassword from "views/Pages/ResetPassword";
import VerifyEmail from "views/Pages/VerifyEmail";
import BulkPayments from "views/Dashboard/BulkPayments";
import { BsStack } from "react-icons/bs";
import {
  HomeIcon,
  StatsIcon,
  CreditIcon,
  PersonIcon,
  DocumentIcon,
  RocketIcon,
  SupportIcon,
  VisaIcon,
  WalletIcon,
  SettingsIcon,
} from "components/Icons/Icons";

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color="inherit" />,
    component: Dashboard,
    layout: "/admin",
    key: "dashboard",
    role: ["user", "admin", "superadmin"],
  },
  {
    path: "/customers",
    name: "Customers",
    rtlName: "لوحة القيادة",
    icon: <StatsIcon color="inherit" />,
    component: Tables,
    layout: "/admin",
    key: "customers",
    role: ["admin", "superadmin"],
  },
  {
    path: "/billing/:id",
    name: "Billing",
    rtlName: "لوحة القيادة",
    icon: <CreditIcon color="inherit" />,
    component: Billing,
    layout: "/admin",
    hide: true,
    key: "customers-detail",
    role: ["admin", "superadmin"],
  },
  {
    path: "/listing/",
    name: "Listing",
    component: SingleCustomer,
    icon: <CreditIcon color="inherit" />,
    layout: "/admin",
    hide: true,
    key: "customers-listing",
    role: ["admin", "superadmin"],
  },

  {
    path: "/payments/",
    name: "Payments",
    icon: <WalletIcon color="inherit" />,
    component: Payments,
    layout: "/admin",
    key: "payments",
    role: ["admin", "superadmin"],
  },

  {
    path: "/detail/:id",
    name: "Payment",
    icon: <CreditIcon color="inherit" />,
    component: Detail,
    layout: "/admin",
    hide: true,
    key: "payment-detail",
    role: ["admin", "superadmin"],
  },

  {
    path: "/bulk-payments",
    name: "Bulk Payments",
    icon: <BsStack color="inherit" />,
    secondaryNavbar: true,
    component: BulkPayments,
    layout: "/admin",
    hide: false,
    key: "bulk-payment-detail",
    role: ["admin", "superadmin"],
  },

  {
    path: "/users",
    name: "Users",
    rtlName: "لوحة القيادة",
    icon: <PersonIcon color="inherit" />,
    secondaryNavbar: true,
    component: Users,
    layout: "/admin",
    hide: false,
    key: "users",
    role: ["superadmin", "admin"],
  },

  {
    path: "/register",
    name: "Register New User",
    rtlName: "لوحة القيادة",
    icon: <RocketIcon color="inherit" />,
    secondaryNavbar: true,
    component: SignUp,
    layout: "/admin",
    hide: false,
    key: "users",
    role: ["superadmin", "admin"],
  },

  // {
  //   path: "/rtl-support-page",
  //   name: "RTL",
  //   rtlName: "آرتيإل",
  //   icon: <SupportIcon color="inherit" />,
  //   component: RTLPage,
  //   layout: "/rtl",
  // },
  {
    name: "ACCOUNT PAGES",
    category: "account",
    rtlName: "صفحات",
    state: "pageCollapse",
    views: [
      {
        path: "/profile",
        name: "Profile",
        rtlName: "لوحة القيادة",
        icon: <PersonIcon color="inherit" />,
        secondaryNavbar: true,
        component: Profile,
        layout: "/admin",
        key: "user-profile",
        role: ["user", "admin", "superadmin"],
      },

      // {
      //   path: "/setting",
      //   name: "Settings",
      //   rtlName: "لوحة القيادة",
      //   icon: <SettingsIcon color="inherit" />,
      //   secondaryNavbar: true,
      //   component: Users,
      //   layout: "/admin",
      //   hide: false,
      // },

      {
        path: "/signin",
        name: "Sign In",
        rtlName: "لوحة القيادة",
        icon: <DocumentIcon color="inherit" />,
        component: SignIn,
        layout: "/auth",
        hide: true,
        key: "user-siginin",
      },

      {
        path: "/forgot-password",
        name: "Forgot Password",
        rtlName: "لوحة القيادة",
        icon: <DocumentIcon color="inherit" />,
        component: ForgotPassword,
        layout: "/auth",
        hide: true,
        key: "forgot-password",
      },

      {
        path: "/verify-email",
        name: "Verify Email",
        rtlName: "لوحة القيادة",
        icon: <DocumentIcon color="inherit" />,
        component: VerifyEmail,
        layout: "/auth",
        hide: true,
        key: "verify-email",
      },

      {
        path: "/password-reset",
        name: "Reset Password",
        rtlName: "لوحة القيادة",
        icon: <DocumentIcon color="inherit" />,
        component: ResetPassword,
        layout: "/auth",
        hide: true,
        key: "password-reset",
      },
      // {
      //   path: "/signup",
      //   name: "Sign Up",
      //   rtlName: "لوحة القيادة",
      //   icon: <RocketIcon color="inherit" />,
      //   secondaryNavbar: true,
      //   component: SignUp,
      //   layout: "/auth",
      //   hide: true,
      // },
      {
        path: "/signout",
        name: "Logout",
        rtlName: "لوحة القيادة",
        icon: <RocketIcon color="inherit" />,
        component: SignOut,
        layout: "/auth",
        key: "user-signout",
      },
    ],
  },
];
export default dashRoutes;

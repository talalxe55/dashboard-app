//export const API_SERVER = process.env.NODE_ENV==="development"?process.env.REACT_APP_API_URL_DEV:process.env.REACT_APP_API_URL_PROD
// export const API_SERVER = "https://project.funnelpageinc.com/api/"
import { useAuth } from "auth-context/auth.context";
export const API_SERVER =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_URL_DEV
    : process.env.REACT_APP_API_URL_PROD;
export const TOKEN_TYPE = "Bearer";
const userToken = JSON.parse(localStorage.getItem("user"));
export const TOKEN = userToken ? userToken.token : "";
// export const TOKEN = JSON.parse(localStorage.getItem("user"))
//   ? JSON.parse(localStorage.getItem("user")).token
//   : "123";
export const ACCEPT_TYPE = "Application/json";  
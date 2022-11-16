export const API_SERVER = "https://project.funnelpageinc.com/api/";
const userToken = JSON.parse(localStorage.getItem("user"));
export const TOKEN_TYPE = "Bearer";
export const TOKEN = userToken ? userToken.token : "";
// export const TOKEN = JSON.parse(localStorage.getItem("user"))
//   ? JSON.parse(localStorage.getItem("user")).token
//   : "123";
export const ACCEPT_TYPE = "Application/json";

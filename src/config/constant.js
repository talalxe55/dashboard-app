export const API_SERVER = "http://192.168.7.51:8001/api/";
const userToken = JSON.parse(localStorage.getItem("user"));
export const TOKEN_TYPE = "Bearer";
export const TOKEN = userToken.token;
// export const TOKEN = JSON.parse(localStorage.getItem("user"))
//   ? JSON.parse(localStorage.getItem("user")).token
//   : "123";
// console.log(TOKEN);
export const ACCEPT_TYPE = "Application/json";

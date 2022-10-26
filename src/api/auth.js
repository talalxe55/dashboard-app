import axios from "./index";
import { API_SERVER, TOKEN_TYPE, TOKEN, ACCEPT_TYPE } from "config/constant";

class AuthApi {
  static Login = (data) => {
    return axios.post(`${base}/login`, data);
  };

  static Register = (data) => {
    return axios.post(`${base}/register`, data);
  };

  static Logout = () => {
    return axios.get(`${base}/logout`, {
      headers: {
        Authorization: `${TOKEN_TYPE} ${TOKEN}`,
        Accept: `${ACCEPT_TYPE}`,
        "Content-Type": `${ACCEPT_TYPE}`,
      },
    });
  };
}

let base = "users";

export default AuthApi;

import { useEffect } from "react";
import AuthApi from "../../api/auth";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../auth-context/auth.context";

function SignOut() {
  const history = useHistory();
  const { setUser } = useAuth();
  let { user } = useAuth();

  const handleLogout = async () => {
    await AuthApi.Logout(user);
    await setUser(null);
    localStorage.removeItem("user");
    alert("User removed");
    return history.push("/auth/signin");
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return null;
}

export default SignOut;

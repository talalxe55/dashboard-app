import { useEffect } from "react";
import AuthApi from "../../api/auth";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../auth-context/auth.context";

function SignOut() {
  const history = useHistory();
  const { setUser } = useAuth();
  let { user } = useAuth();

  const handleLogout = async () => {
    console.log("test");
    // await AuthApi.Logout(user);
    // await setUser(null);
    localStorage.removeItem("user");
    alert("User removed");
    history.push("/auth/signin");
    window.location.reload(false);
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return null;
}

export default SignOut;

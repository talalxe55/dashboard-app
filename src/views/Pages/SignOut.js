import { useEffect } from "react";
import AuthApi from "../../api/auth";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../auth-context/auth.context";

function SignOut() {
  const history = useHistory();
  const { setUser } = useAuth();
  let { user } = useAuth();

  const handleLogout = async () => {
    if(localStorage.getItem('user')){
    try{
      const response = await AuthApi.Logout(user);
      if(response.status==200){
        if(response.data.success==true){
          localStorage.removeItem("user");
          setUser(null)
          history.push("/auth/signin");
          window.location.reload(false);
        }
      }

    }
    catch(err){
      if(err.response.status==401){
        history.push("/auth/signin");
        window.location.reload(false);
      }
      
      
    }

    
    // await setUser(null);
  }
  else{
    history.push("/auth/signin");
  }
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return null;
}

export default SignOut;

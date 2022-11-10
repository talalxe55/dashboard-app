import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getRefreshToken } from "api/ApiListing";
import { useToast } from "@chakra-ui/react";
import { useAuth } from "auth-context/auth.context";

const RefreshingToken = () => {
  const { setUser } = useAuth();
  const { user } = useAuth();
  const [refUser, setRefUser] = useState(false);
  const toast = useToast();
  const history = useHistory();

  useEffect(() => {
    let currDate = new Date();
    let newCurrDate = new Date();
    newCurrDate.setMinutes(currDate.getMinutes() + 1);
    // console.log(newCurrDate.getSeconds(), currDate.getSeconds());

    setInterval(() => {
      const userToken = JSON.parse(localStorage.getItem("user"));
      if (userToken !== null) {
        let currDate = new Date();
        let expireTime = new Date(userToken.expires_at);

        //console.log(currDate.getMinutes() - expireTime.getMinutes());
        // console.log(currDate);
        if (expireTime < currDate) {
          localStorage.removeItem("user");
          history.push("/auth/signin");
        } else if (
          currDate < expireTime &&
          currDate.getMinutes() - expireTime.getMinutes() < 2
        ) {
          if (refUser) {
            return;
          }
          getRefreshToken()
            .then((res) => {
              if (res !== undefined && res.status === 200) {
                toast({
                  title: "New Token Refreshed",
                  description: "",
                  status: "info",
                  duration: 3000,
                  isClosable: true,
                });
                user.token = res.data.user.token;
                user.expires_at = res.data.user.expires_at;
                user = JSON.stringify(user);
                setUser(user);
                console.log(res);
                setRefUser(true);
              } else {
                console.log(res);
              }
            })
            .catch((err) =>
              err
                ? toast({
                    title: "Getting Error!",
                    description: "",
                    status: "error",
                    duration: 1000,
                    isClosable: true,
                  }) && console.log(err)
                : console.log(err)
            );
        }
      }
    }, 1000);
  }, []);
  return <></>;
};

export default RefreshingToken;

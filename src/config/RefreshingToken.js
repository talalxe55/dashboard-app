import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getRefreshToken } from "api/ApiListing";
import { useToast } from "@chakra-ui/react";
import { useAuth } from "auth-context/auth.context";
import AuthApi from "api/auth";
import { useIdleTimer } from 'react-idle-timer'

const RefreshingToken = () => {
  const { setUser } = useAuth();
  const { user } = useAuth();
  const [count, setcount] = useState(0);
  const [refUser, setRefUser] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const LogoutUser =  async () => {
    try{
      const response = await AuthApi.Logout();
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
        localStorage.removeItem("user");
        setUser(null)
        window.location.reload(false);
      }
      
      
    }
  }

  const onIdle = () => {
    // Close Modal Prompt
    // Do some idle action like log out your user
    LogoutUser();
    
    
  }

  const onActive = (event) => {
    // Close Modal Prompt
    // Do some active action
    console.log('active')
    let currDate = new Date();
    let newCurrDate = new Date();
    newCurrDate.setMinutes(currDate.getMinutes() + 1);
    
  }

  const onAction = (event) => {
    // Do something when a user triggers a watched event
  //   const userToken = JSON.parse(localStorage.getItem("user"));
  //   console.log(userToken)
  //   if (userToken !== null) {
  //     let currDate = new Date();
  //     let expireTime = new Date(userToken.expires_at);

  //     //console.log(currDate.getMinutes() - expireTime.getMinutes());
  //     // console.log(currDate);
  //     if (expireTime < currDate) {
  //       localStorage.removeItem("user");
  //       history.push("/auth/signin");
  //     } else if (
  //       currDate < expireTime 
  //     ) {
  //       console.log('here');
  //       var diff = Math.abs(expireTime - currDate);
  //       var minutes = Math.floor((diff/1000)/60);
  //       console.log(getRemainingTime())
  //       if(minutes < 2){
          
  //         pause(true);

  //         getRefreshToken()
  //         .then((res) => {
  //           if (res !== undefined && res.status === 200) {
  //             let newuser = JSON.parse(localStorage.getItem('user'));
  //             newuser.token = res.data.user.token;
  //             console.log(res.data.user.token)
  //             newuser.expires_at = res.data.user.expires_at;
  //             var setuser = JSON.stringify(newuser);
  //             setUser(setuser);
  //             localStorage.removeItem('user')
  //             localStorage.setItem("user", setuser)
  //             return start();
  //           } else {
  //             resume(true);
  //           }
  //         })
  //         .catch((err) =>{
  //           return;
  //         }
  //         );

  //       }



  //     }
  //  }
  }

  const {    
    start,
    reset,
    activate,
    pause,
    resume,
    isIdle,
    isPrompted,
    isLeader,
    getTabId,
    getRemainingTime,
    getElapsedTime,
    getLastIdleTime,
    getLastActiveTime,
    getTotalIdleTime,
    getTotalActiveTime} = useIdleTimer({ onIdle, onActive, onAction, timeout: 1000 * 60 * 2,
    events: [
      'mousemove',
      'keydown',
      'wheel',
      'DOMMouseScroll',
      'mousewheel',
      'mousedown',
      'touchstart',
      'touchmove',
      'MSPointerDown',
      'MSPointerMove',
      'visibilitychange'
    ],})
    
  // const countHandler = (counter) => {
  //   setcount(counter);
  // }
  // var counter = 0;
  
  // window.addEventListener('mousemove', setcount(0));
  // window.addEventListener('scroll', setcount(0));
  // window.addEventListener('keydown', setcount(0));
  useEffect(() => {
    let currDate = new Date();
    let newCurrDate = new Date();
    newCurrDate.setMinutes(currDate.getMinutes() + 1);
    // console.log(newCurrDate.getSeconds(), currDate.getSeconds());

    // console.log(count)
    // if(count > 120){
    //   console.log('logout')
    // }
  }, [count]);
  return <></>;
};

export default RefreshingToken;

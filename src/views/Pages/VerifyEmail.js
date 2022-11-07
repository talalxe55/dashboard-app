import React, { useState, useEffect } from "react";
// Chakra imports
import {
  Box,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  useToast,

  Spinner,
} from "@chakra-ui/react";
import {CheckIcon, CloseIcon} from "@chakra-ui/icons";
// Assets

import { useAuth } from "../../auth-context/auth.context";
import { NavLink, useHistory, useLocation, useParams } from "react-router-dom";
import { verifyEmail } from "api/ApiListing";
import { AlertPasswordReset } from "theme/components/AlertDialog";

function VerifyEmail() {

  // Chakra color mode
  const toast = useToast();
  const titleColor = useColorModeValue("red.450", "red.500");
  const textColor = useColorModeValue("gray.400", "white");
  const primaryColor = useColorModeValue("primaryColor.700");
  const primaryColorHover = useColorModeValue("primaryColorHover.700");
  const history = useHistory();
  const { setUser } = useAuth();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [isloading, setisloading] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(undefined);
  const [buttonText, setButtonText] = useState("Reset Password!");
  const [show, setShow] = useState(false)
  const [newshow, setnewShow] = useState(false)
  const [istokenValid, setistokenValid] = useState(false);
  const [isSuccess, setisSuccess] = useState(false);
  const [isError, setisError] = useState(false);
  const [verifiedMessage, setverifiedMessage] = useState("");
  const { search } = useLocation();
  let query = React.useMemo(() => new URLSearchParams(search), [search]);



  useEffect(() => {
    
    if(query.get('url') !== null) {
        
        const response = verifyEmail(decodeURI(query.get('url')))

        response.then((res) => {
        setisloading(false);
        if(res.data.success==true){
            
            
            if(user && user.token){
                setTimeout(function() {       
                    toast({
                title: 'Email Verfied!',
                description: res.data.message,
                status: 'success',
                duration: 5000,
                isClosable: true,
                })
                setverifiedMessage("");
                history.push('/admin/dashboard') 
            }, 5000);

            }
            else{
                setTimeout(function() {       
                    toast({
                title: 'Email Verfied!',
                description: res.data.message,
                status: 'success',
                duration: 5000,
                isClosable: true,
                })
                setverifiedMessage("");
                history.push('/auth/signin') 
            }, 5000);

            }

        
        }
    }).catch((err) => {
        setisSuccess(true);
        setisError(true);
       
        if (err.response) {
            setverifiedMessage(err.response.data.message);
        }
        else{
            return setverifiedMessage("An error occured. Please try again!");
        }
    })
      
    }


  }, []);



  return !isSuccess?(
    
    <Flex position="relative">
        
      <Flex
        h={{ sm: "initial", md: "75vh", lg: "85vh" }}
        w="100%"
        maxW="1044px"
        mx="auto"
        justifyContent="center"
        mb="30px"
        pt={{ sm: "100px", md: "0px" }}
      >
        <Flex
          alignItems="center"
          justifyContent="center"
          style={{ userSelect: "none" }}
          w={{ base: "100%", md: "50%", lg: "42%" }}
        >
            <Spinner size={"xl"} color="teal.300"/>
            <Heading color={titleColor} fontSize="32px" mt="10px" mb="10px" m="10px">
        Verifying Your Email..
        </Heading>
          
          
        </Flex>
      </Flex>
    </Flex>
  ):(    <Flex position="relative">
  
<Flex
  h={{ sm: "initial", md: "75vh", lg: "85vh" }}
  w="100%"
  maxW="1044px"
  mx="auto"
  justifyContent="center"
  mb="30px"
  pt={{ sm: "100px", md: "0px" }}
>
  <Flex
    alignItems="center"
    justifyContent="start"
    style={{ userSelect: "none" }}
    w={{ base: "100%", md: "50%", lg: "52%" }}
  >
 {isError?<CloseIcon fontSize={"35px"} color={"red"}/>:<CheckIcon fontSize={"35px"} color={"green"}/>}
<Heading color={isError?"teal.300":"green"} fontSize="25px" mt="10px" mb="10px" m="10px" >
          {verifiedMessage}
        </Heading>

  </Flex>

        
</Flex>
</Flex>);
}

export default VerifyEmail;

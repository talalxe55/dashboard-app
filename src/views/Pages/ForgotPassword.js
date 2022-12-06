import React, { useState } from "react";
// Chakra imports
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Switch,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
// Assets
import signInImage from "assets/img/no-limi-RED-logo-opt-2.png";

import { useAuth } from "../../auth-context/auth.context";
import AuthApi from "../../api/auth";

import { NavLink, useHistory } from "react-router-dom";
import { forgotPassword } from "api/ApiListing";

function ForgotPassword() {
  // Chakra color mode
  const toast = useToast();
  const titleColor = useColorModeValue("red.450", "red.500");
  const textColor = useColorModeValue("gray.400", "white");
  const primaryColor = useColorModeValue("primaryColor");
  const primaryColorHover = useColorModeValue("primaryColorHover");
  const history = useHistory();
  const { setUser } = useAuth();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [isloading, setisloading] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(undefined);
  const [buttonText, setButtonText] = useState("Send Email!");

  const login = async (event) => {
    if (event) {
      event.preventDefault();
    }

    if (email === "") {
      return setError("You must enter your email.");
    }

    //setButtonText("Signing in");
    let payload = {};
    payload["email"] = email;
    const response = forgotPassword(payload);
    response
      .then((res) => {
        setisloading(false);
        if (res.data.status == "passwords.sent") {
          setButtonText("Email sent!");
          toast({
            title: "Email Sent Successfully!",
            description: res.data.message,
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        }
      })
      .catch((err) => {
        setisloading(false);
        setButtonText("Resend Email!");
        if (err.response) {
          if (err.response.data.message.email) {
            return setError(err.response.data.message.email);
          } else {
            return setError(err.response.data.message);
          }
        } else {
          return setError("Email could not be sent. Please try again!");
        }
      });
  };

  const setProfile = async (response) => {
    let user = { ...response.data.user };
    user.token = response.data.user.token;
    user = JSON.stringify(user);
    setUser(user);
    localStorage.setItem("user", user);
    history.push("/dashboard");
    window.location.reload(false);
  };

  return (
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
          justifyContent="start"
          style={{ userSelect: "none" }}
          w={{ base: "100%", md: "50%", lg: "42%" }}
        >
          {/*           
            <div>
              <Heading color={titleColor} fontSize="32px" mt="10px" mb="10px">
                Welcome Back
              </Heading>
              <h3 style={{ textAlign: "center" }}>
                You are already signed in.
              </h3>
              <Button
                fontSize="15px"
                type="submit"
                bg="primaryColor"
                w="100%"
                h="45"
                mb="20px"
                color="white"
                mt="20px"
                _hover={{
                  bg: "teal.200",
                }}
                _active={{
                  bg: "teal.400",
                }}
                onClick={login}
              >
                {`Let's go`}
              </Button>
            </div> */}

          <Flex
            direction="column"
            w="100%"
            background="transparent"
            p="48px"
            mt={{ md: "150px", lg: "80px" }}
          >
            <Heading color={titleColor} fontSize="32px" mt="10px" mb="10px">
              Reset Password
            </Heading>
            <Text
              mb="36px"
              ms="4px"
              color={textColor}
              fontWeight="bold"
              fontSize="14px"
            >
              Enter your account email address.
            </Text>
            <FormControl>
              <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                Email
              </FormLabel>
              <Input
                borderRadius="15px"
                mb="24px"
                fontSize="sm"
                type="text"
                placeholder="Your email adress"
                size="lg"
                id="email"
                defaultValue={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError(undefined);
                }}
              />
              {/* <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Password
                </FormLabel>
                <Input
                  borderRadius="15px"
                  mb="36px"
                  id="password"
                  fontSize="sm"
                  type="password"
                  placeholder="Your password"
                  size="lg"
                  defaultValue={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError(undefined);
                  }}
                /> */}
              {/* <FormControl display="flex" alignItems="center">
                  <Switch id="remember-login" colorscheme="teal" me="10px" />
                  <FormLabel
                    htmlFor="remember-login"
                    mb="1"
                    ms="1"
                    fontWeight="normal"
                  >
                    Remember me
                  </FormLabel>
                </FormControl> */}
              <h4
                style={{
                  fontSize: ".9em",
                  color: "red",
                  textAlign: "center",
                  fontWeight: 400,
                  transition: ".2s all",
                }}
              >
                {error}
              </h4>
              <Button
                fontSize="18px"
                isLoading={isloading}
                loadingText={"Sending Email.."}
                type="submit"
                bg={primaryColor}
                w="100%"
                h="45"
                mb="20px"
                color="white"
                mt="20px"
                _hover={{
                  bg: { primaryColorHover },
                }}
                _active={{
                  bg: "teal.400",
                }}
                onClick={() => {
                  setisloading(true);
                  login();
                }}
              >
                {buttonText}
              </Button>
              {/* <NavLink color="primaryColor" _hover={{color: "primaryColor"}} to={"/auth/forgot-password"}>               <Text
                mb="36px"
                ms="4px"
                color={textColor}
                fontWeight="bold"
                fontSize="14px"
                _hover={{color: "primaryColor"}}
              >
                Forgot Password?
              </Text></NavLink> */}
            </FormControl>
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              maxW="100%"
              mt="0px"
            >
              {" "}
              <NavLink
                color="primaryColor"
                _hover={{ color: "primaryColor" }}
                to={"/auth/signin"}
              >
                {" "}
                <Text
                  mb="36px"
                  ms="4px"
                  color={textColor}
                  fontWeight="bold"
                  fontSize="14px"
                  _hover={{ color: "primaryColor" }}
                >
                  SignIn?
                </Text>
              </NavLink>
            </Flex>
          </Flex>
        </Flex>
        {/* <Box
          display={{ base: "none", md: "block" }}
          overflowX="hidden"
          h="100%"
          w="55vw"
          position="absolute"
          right="0px"
        >
          <Box
            bgImage={signInImage}
            w="80%"
            h="40%"
            bgSize="contain"
            bgRepeat="no-repeat"
            bgPosition="50%"
            position="absolute"
            top="30%"
            borderBottomLeftRadius="0"
            backgroundColor={"white"}
          ></Box>
        </Box> */}
      </Flex>
    </Flex>
  );
}

export default ForgotPassword;

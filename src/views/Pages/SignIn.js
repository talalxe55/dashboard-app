import React, { useEffect, useState } from "react";
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
  HStack,
  PinInput,
  PinInputField,
  Spinner
} from "@chakra-ui/react";
// Assets
import signInImage from "assets/img/no-limi-RED-logo-opt-2.png";
import LogoW from "assets/img/logos/nls-logo-w.png";

import { useAuth } from "../../auth-context/auth.context";
import AuthApi from "../../api/auth";

import { NavLink, useHistory } from "react-router-dom";
import { verifyOTP, sendOTPConfig } from "api/ApiListing";
import { RiLoader2Fill } from "react-icons/ri";

function SignIn() {
  // Chakra color mode
  const titleColor = useColorModeValue("red.450", "red.500");
  const textColor = useColorModeValue("gray.400", "white");
  const primaryColor = useColorModeValue("primaryColor");
  const primaryColorHover = useColorModeValue("primaryColorHover");
  const history = useHistory();
  const { setUser } = useAuth();
  const { user } = useAuth();
  const toast = useToast();

  const [otpCode, setotpCode] = useState("");
  const [otp1, setOtp1] = useState("");
  const [otp2, setOtp2] = useState("");
  const [otp3, setOtp3] = useState("");
  const [otp4, setOtp4] = useState("");
  const [otp5, setOtp5] = useState("");
  const [otp6, setOtp6] = useState("");
  const [otpToken, setotpToken] = useState("");
  const [otpPrompt, setotpPrompt] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(undefined);
  const [loader, setloader] = useState(false);
  const [buttonText, setButtonText] = useState("Sign in");

  const otpPinData = {
    otp1,
    otp2,
    otp3,
    otp4,
    otp5,
    otp6,
  };
  
  const resetotp = e => {
    setOtp1(null);
    setOtp2(null);
    setOtp3(null);
    setOtp4(null);
    setOtp5(null);
    setOtp6(null);
  };

  useEffect(() => {
    if(!otp1 || !otp2 || !otp3 || !otp4 || !otp5 || !otp6){
      return;
    }
    else{
      verifyOtp();
    }
  }, [otp6]);
  const login = async (event) => {
    if (event) {
      event.preventDefault();
    }
    if (user && user.token) {
      return history.push("/admin/customers");
    }
    if (email === "") {
      return setError("You must enter your email.");
    }
    if (password === "") {
      return setError("You must enter your password");
    }
    setError("");
    setButtonText("Signing in");
    try {
      let response = await AuthApi.Login({
        email,
        password,
      });
      if (response.data && response.data.success === false) {
        setButtonText("Sign in");
        return setError(response.data.message);
      }
      setotpToken(response.data.user.token);
      setButtonText("Verify OTP");
      return setotpPrompt(true);
    } catch (err) {
      setButtonText("Sign in");
      if (err.response) {
        if (err.response.data.message.email) {
          return setError(err.response.data.message.email);
        }
        if (err.response.data.message.password) {
          return setError(err.response.data.message.password);
        }
        return setError(err.response.data.message);
      }
      return setError("There has been an error.");
    }
  };

  const verifyOtp = async (event) => {
    let otpcode = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;
    if (event) {
      event.preventDefault();
    }
    if (user && user.token) {
      return history.push("/admin/customers");
    }
    if (otpcode === "" || otpcode === null) {
      return setError("You must enter your OTP!.");
    }
    setButtonText("Verifying OTP..");
    setloader(true);
    try {
      let response = await verifyOTP(otpcode, otpToken);
      if (response.data && response.data.success === false) {
        resetotp();
        setloader(false);
        setButtonText("Invalid or Expired Code!");
        return setError(response.data.message);
      }
      // setotpToken(response.data.user.token);
      // setotpPrompt(true);
      return setProfile(response);
    } catch (err) {
      setButtonText("Verify OTP");
      if (err.response.status == 400) {
        if (err.response.data.message === "Too many attempts!") {
          setotpPrompt(false);
        }
        resetotp();
        setloader(false);
        return setError(err.response.data.message);
      }

      if (err.response.status == 401) {
        setotpPrompt(false);
        resetotp();
        setloader(false);
        setError("Please sign in again!");
        return setButtonText("Sign in");
      }
      return setError("There has been an error.");
    }
  };

  const emailOTPverification = async (event) => {
    if (event) {
      event.preventDefault();
    }
    setButtonText("Sending Email..");
    try {
      let response = await sendOTPConfig(otpToken);
      if (response.data && response.data.success === false) {
        setButtonText("Verify OTP!");
        return setError(response.data.message);
      }
      // setotpToken(response.data.user.token);
      // setotpPrompt(true);
      toast({
        title: "Email Sent!",
        description: "Please check your email!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setotpPrompt(false);
      return setButtonText("Sign in");
    } catch (err) {
      setButtonText("Verify OTP");
      if (err.response.status == 400) {
        return setError(err.response.data.message);
      }
      if (err.response.status == 401) {
        setotpPrompt(false);
        setError("Please sign in again!");
        return setButtonText("Sign in");
      }
      return setError("There has been an error.");
    }
  };

  const setProfile = (response) => {
    let user = { ...response.data.user };
    user.token = response.data.user.token;
    user = JSON.stringify(user);
    setUser(user);
    localStorage.setItem("user", user);
    history.push("/admin/customers");
    window.location.reload(false);
  };

  return otpPrompt ? (
    <Flex position="relative" mb="40px">
      <Flex
        h={{ sm: "initial", md: "75vh", lg: "85vh" }}
        w="100%"
        maxW="1044px"
        mx="auto"
        justifyContent="space-between"
        mb="30px"
        pt={{ sm: "100px", md: "0px" }}
      >
        <Flex
          alignItems="center"
          justifyContent="start"
          style={{ userSelect: "none" }}
          w={{ base: "100%", md: "50%" }}
        >
          <Flex
            direction="column"
            w="100%"
            background="transparent"
            p="48px"
            mt={{ md: "150px", lg: "80px" }}
          >
            <Heading color={titleColor} fontSize="32px" mt="10px" mb="10px">
              OTP Verification
            </Heading>
           <Text
              mb="36px"
              ms="4px"
              color={textColor}
              fontWeight="bold"
              fontSize="14px"
            >
              Please enter the OTP from Google Authenticator App!
            </Text>
            <FormControl>
              <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                Enter your one-time otp password
              </FormLabel>
              {!loader?<HStack
                id="otp"
                // value={otpCode}
                // onChange={(event) => {
                //   setSumOtpCode(event.target.value);
                //   setError(undefined);
                // }}
              >
                <PinInput otp
                // onChange={handleSubmit}
                >
                  <PinInputField
                    maxLength={1}
                    value={otp1}
                    onChange={(e) => setOtp1(e.target.value)}
                  />
                  <PinInputField
                    maxLength={1}
                    value={otp2}
                    onChange={(e) => setOtp2(e.target.value)}
                  />
                  <PinInputField
                    maxLength={1}
                    value={otp3}
                    onChange={(e) => setOtp3(e.target.value)}
                  />
                  <PinInputField
                    maxLength={1}
                    value={otp4}
                    onChange={(e) => setOtp4(e.target.value)}
                  />
                  <PinInputField
                    maxLength={1}
                    value={otp5}
                    onChange={(e) => setOtp5(e.target.value)}
                  />
                  <PinInputField
                    maxLength={1}
                    value={otp6}
                    onChange={(e) => setOtp6(e.target.value)}
                  />
                </PinInput>
              </HStack>:        <Flex
          alignItems="center"
          justifyContent="start"
          style={{ userSelect: "none" }}
          w={{ base: "100%", md: "50%" }}
          margin="0 auto"
        ><Spinner color="red.500" /></Flex>} 
              {/* <Button
                onClick={() => setotpCode(Object.values(otpPinData).join(""))}
              >
                TEST OTP LOCAL
              </Button> */}
              {/* <Input
                borderRadius="15px"
                mb="24px"
                fontSize="sm"
                type="text"
                placeholder="Enter your one-time otp password"
                size="lg"
                id="otp"
                value={otpCode}
                onChange={(event) => {
                  setotpCode(event.target.value);
                  setError(undefined);
                }}
              /> */}
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
              {/* <Button
                fontSize="18px"
                type="submit"
                bg="primaryColor"
                w="100%"
                h="45"
                mb="20px"
                color="white"
                mt="20px"
                _hover={{
                  bg: "primaryColorHover",
                }}
                _active={{
                  bg: "black",
                }}
                onClick={
                  (() => setotpCode(Object.values(otpPinData).join("")),
                  verifyOtp)
                }
              >
                {buttonText}
              </Button> */}
              <Button
                onClick={emailOTPverification}
                color={textColor}
                _hover={{ color: "primaryColor" }}
                fontWeight="bold"
                fontSize={14}
                // w={{ sm: 100, md: 200 }}
                whiteSpace={"break-spaces"}
                p={8}
                textAlign="start"
              >
                Not configured yet? Click to ask for configuration email!
              </Button>
            </FormControl>
          </Flex>
        </Flex>
        <Box
          display={{ base: "none", md: "block" }}
          overflowX="hidden"
          h="100%"
          w="55vw"
          position="absolute"
          right="0px"
        >
          <Box
            bgImage={
              document
                .getElementsByTagName("body")[0]
                .classList.contains("chakra-ui-dark") === true
                ? LogoW
                : signInImage
            }
            w="70%"
            h="40%"
            bgSize="contain"
            bgRepeat="no-repeat"
            bgPosition="50%"
            position="absolute"
            top="35%"
            left="15%"
            borderBottomLeftRadius="0"
          ></Box>
        </Box>
      </Flex>
    </Flex>
  ) : (
    <Flex position="relative" mb="40px">
      <Flex
        h={{ sm: "initial", md: "75vh", lg: "85vh" }}
        w="100%"
        maxW="1044px"
        mx="auto"
        justifyContent="space-between"
        mb="30px"
        pt={{ sm: "100px", md: "0px" }}
      >
        <Flex
          alignItems="center"
          justifyContent="start"
          style={{ userSelect: "none" }}
          w={{ base: "100%", md: "50%" }}
        >
          {user && user.token ? (
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
                  bg: "primaryColorHover",
                }}
                _active={{
                  bg: "primaryColorHover",
                }}
                onClick={login}
              >
                {`Let's go`}
              </Button>
            </div>
          ) : (
            <Flex
              direction="column"
              w="100%"
              background="transparent"
              p="48px"
              mt={{ md: "150px", lg: "80px" }}
            >
              <Heading color={titleColor} fontSize="32px" mt="10px" mb="10px">
                NLS99 Payments
              </Heading>
              <Text
                mb="36px"
                ms="4px"
                color={textColor}
                fontWeight="bold"
                fontSize="14px"
              >
                Enter your email and password to sign in
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
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
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
                />
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
                  type="submit"
                  bg="primaryColor"
                  w="100%"
                  h="45"
                  mb="20px"
                  color="white"
                  mt="20px"
                  _hover={{
                    bg: "primaryColorHover",
                  }}
                  _active={{
                    bg: "black",
                  }}
                  onClick={login}
                >
                  {buttonText}
                </Button>
                <NavLink
                  color="primaryColor"
                  _hover={{ color: "primaryColor" }}
                  to={"/auth/forgot-password"}
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
                    Forgot Password?
                  </Text>
                </NavLink>
              </FormControl>
              <Flex
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                maxW="100%"
                mt="0px"
              ></Flex>
            </Flex>
          )}
        </Flex>
        <Box
          display={{ base: "none", md: "block" }}
          overflowX="hidden"
          h="100%"
          w="55vw"
          position="absolute"
          right="0px"
        >
          <Box
            bgImage={
              document
                .getElementsByTagName("body")[0]
                .classList.contains("chakra-ui-dark") === true
                ? LogoW
                : signInImage
            }
            w="70%"
            h="40%"
            bgSize="contain"
            bgRepeat="no-repeat"
            bgPosition="50%"
            position="absolute"
            top="35%"
            left="15%"
            borderBottomLeftRadius="0"
          ></Box>
        </Box>
      </Flex>
    </Flex>
  );
}

export default SignIn;

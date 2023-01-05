import React, { useState, useEffect } from "react";
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
  InputGroup,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";
// Assets

import { useAuth } from "../../auth-context/auth.context";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { resetPassword, getUser } from "api/ApiListing";
import { AlertPasswordReset } from "theme/components/AlertDialog";

function ResetPassword() {
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
  const [buttonText, setButtonText] = useState("Reset Password!");
  const [show, setShow] = useState(false);
  const [newshow, setnewShow] = useState(false);
  const [istokenValid, setistokenValid] = useState(false);
  const [isSuccess, setisSuccess] = useState(false);
  const { search } = useLocation();
  let query = React.useMemo(() => new URLSearchParams(search), [search]);

  const handleClick = () => setShow(!show);
  const handlenewClick = () => setnewShow(!newshow);
  const handleValues = (e) => {
    const { name, value } = e.target;
    setVals((preval) => {
      return {
        ...preval,
        [name]: value,
      };
    });
  };
  const [vals, setVals] = useState({
    password: "",
    password_confirmation: "",
  });
  const errSet = {
    password: "",
    password_confirmation: "",
  };
  const [errvals, seterrVals] = useState(errSet);

  useEffect(() => {
    if (user && user.token) {
      history.push("/admin/customers");
    }
  }, []);
  const login = async (event) => {
    if (event) {
      event.preventDefault();
    }

    // if (email === "") {
    //   return setError("You must enter your email.");
    // }

    //setButtonText("Signing in");

    let payload = {};
    payload["email"] = query.get("email");
    payload["token"] = query.get("token");
    payload["password"] = vals.password;
    payload["password_confirmation"] = vals.password_confirmation;
    const response = resetPassword(payload);
    response
      .then((res) => {
        setisloading(false);
        if (res.data.status == "passwords.reset") {
          setisSuccess(true);
          setButtonText("Reset Password!");
          //               toast({
          //     title: 'Password Reset Successfully!',
          //     description: res.data.message,
          //     status: 'success',
          //     duration: 9000,
          //     isClosable: true,
          //   })
        }
      })
      .catch((err) => {
        setisloading(false);
        setButtonText("Reset Password!");
        if (err.response) {
          if (err.response.data.message.email) {
            return setError(
              "Invalid email! Please request the reset code or try again!"
            );
          } else if (err.response.data.message.token) {
            return setError(
              "Invalid token! Please request the reset code again!"
            );
          } else if (err.response.data.message.password) {
            errvals["password"] = err.response.data.message.password;
            seterrVals({ ...errvals });
          } else if (err.response.data.message.confirm_password) {
            errvals["confirm_password"] =
              err.response.data.message.confirm_password;
            seterrVals({ ...errvals });
          } else if (err.response.data.status == "passwords.token") {
            return setError(
              "Invalid or expired token. Please request the reset code again!"
            );
          } else if (err.response.data.status == "passwords.user") {
            return setError(
              "Invalid email! Please request the reset code again!"
            );
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
      {isSuccess ? <AlertPasswordReset /> : null}
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
              Enter your new password.
            </Text>
            <FormControl>
              <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                New Password
              </FormLabel>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={show ? "text" : "password"}
                  placeholder="Enter your new password"
                  name="password"
                  onChange={handleValues}
                  value={vals.password}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>

              <h4
                style={{
                  fontSize: ".9em",
                  color: "red",
                  textAlign: "center",
                  fontWeight: 400,
                  transition: ".2s all",
                }}
              >
                {errvals.password}
              </h4>
            </FormControl>

            <FormControl>
              <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                Confirm Password
              </FormLabel>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={newshow ? "text" : "password"}
                  placeholder="Re-enter your new password"
                  name="password_confirmation"
                  onChange={handleValues}
                  value={vals.password_confirmation}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handlenewClick}>
                    {newshow ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>

              <h4
                style={{
                  fontSize: ".9em",
                  color: "red",
                  textAlign: "center",
                  fontWeight: 400,
                  transition: ".2s all",
                }}
              >
                {errvals.password_confirmation}
              </h4>
            </FormControl>

            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              maxW="100%"
              mt="0px"
            >
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
                loadingText={"Resetting Password.."}
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
                  setError(undefined);
                  seterrVals(errSet);
                  setisloading(true);
                  login();
                }}
              >
                {buttonText}
              </Button>
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

export default ResetPassword;
